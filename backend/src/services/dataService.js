import {
  AthenaClient,
  StartQueryExecutionCommand,
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
} from "@aws-sdk/client-athena";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export const fetchHistoryData = async ({ tractorId, startDate, endDate }) => {
  try {

    const athenaClient = new AthenaClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    let tId = String(tractorId).trim().replace(/'/g, "''");

    const queryString = `
      SELECT 
        accId, accountId, contact, course, deviceId, deviceTime, devicetags, disabled, 
        fixTime, lastupdate, latitude, longitude, model, name, speed, state, statesince, 
        staticField, type, uniqueid, valid, p_date, p_hour,
        attributes.alarm, attributes.batOta, attributes.batOva, attributes.batUva, 
        attributes.battCurrent, attributes.battEnergy, attributes.battVoltage, 
        attributes.battery, attributes.canBusStatus, attributes.cellVoltDiff, 
        attributes.charDischarState, attributes.chargeCycleCount, attributes.chargeTime, 
        attributes.contFault, attributes.contOca, attributes.controllerTemp, 
        attributes.dischargeCycleCount, attributes.distToEmpty, attributes.fwVersion, 
        attributes.ignition, attributes.iotVoltage, attributes.maxCellVoltage, 
        attributes.minCellVoltage, attributes.motion, attributes.motorFault, 
        attributes.motorSpeed, attributes.motorTemp, attributes.odoCan, attributes.odokm, 
        attributes.odometer, attributes.power, attributes.protection, attributes.ratedCapacity, 
        attributes.regenFlag, attributes.rssi, attributes.rstRsn, attributes.sat, 
        attributes.soc, attributes.soh, attributes.speed, attributes.thermRa, 
        attributes.timeToDischarge, attributes.totRst
      FROM tractor_data_optimized 
      WHERE p_date BETWEEN '${startDate}' AND '${endDate}'
        AND lower(trim(name)) = lower(trim('${tId}'))
      ORDER BY fixtime ASC
      LIMIT 50;
    `;

    const startQuery = new StartQueryExecutionCommand({
      QueryString: queryString,
      QueryExecutionContext: { Database: process.env.ATHENA_DATABASE_NAME },
      ResultConfiguration: { OutputLocation: process.env.ATHENA_OUTPUT_LOCATION },
    });

    const { QueryExecutionId } = await athenaClient.send(startQuery);

    let state = "QUEUED";
    let attempts = 0;

    while (["RUNNING", "QUEUED"].includes(state)) {
      if (attempts >= 30) throw new Error("Athena query timeout");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;

      const execution = await athenaClient.send(
        new GetQueryExecutionCommand({ QueryExecutionId })
      );
      state = execution.QueryExecution.Status.State;

      if (state === "FAILED" || state === "CANCELLED") {
        throw new Error(`Query failed: ${execution.QueryExecution.Status.StateChangeReason}`);
      }
    }

    const result = await athenaClient.send(
      new GetQueryResultsCommand({ QueryExecutionId, MaxResults: 51 })
    );

    const rows = result.ResultSet.Rows || [];
    if (rows.length <= 1) return []; 

    const columns = rows[0].Data.map((col) => col.VarCharValue);

    return rows.slice(1).map((row) => {
      const obj = {};
      row.Data.forEach((val, idx) => {
        obj[columns[idx]] = val.VarCharValue !== undefined ? val.VarCharValue : null;
      });
      return obj;
    });

  } catch (err) {
    console.error("❌ Preview Error:", err.message);
    throw err;
  }
};

export const exportHistoryDataS3 = async ({ tractorId, startDate, endDate }) => {
  try {
    const athenaClient = new AthenaClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    let tId = String(tractorId).trim().replace(/'/g, "''");

    const queryString = `
      SELECT 
        accId, accountId, contact, course, deviceId, deviceTime, devicetags, disabled, 
        fixTime, lastupdate, latitude, longitude, model, name, speed, state, statesince, 
        staticField, type, uniqueid, valid, p_date, p_hour,
        attributes.alarm, attributes.batOta, attributes.batOva, attributes.batUva, 
        attributes.battCurrent, attributes.battEnergy, attributes.battVoltage, 
        attributes.battery, attributes.canBusStatus, attributes.cellVoltDiff, 
        attributes.charDischarState, attributes.chargeCycleCount, attributes.chargeTime, 
        attributes.contFault, attributes.contOca, attributes.controllerTemp, 
        attributes.dischargeCycleCount, attributes.distToEmpty, attributes.fwVersion, 
        attributes.ignition, attributes.iotVoltage, attributes.maxCellVoltage, 
        attributes.minCellVoltage, attributes.motion, attributes.motorFault, 
        attributes.motorSpeed, attributes.motorTemp, attributes.odoCan, attributes.odokm, 
        attributes.odometer, attributes.power, attributes.protection, attributes.ratedCapacity, 
        attributes.regenFlag, attributes.rssi, attributes.rstRsn, attributes.sat, 
        attributes.soc, attributes.soh, attributes.speed, attributes.thermRa, 
        attributes.timeToDischarge, attributes.totRst
      FROM tractor_data_optimized 
      WHERE p_date BETWEEN '${startDate}' AND '${endDate}'
        AND lower(trim(name)) = lower(trim('${tId}'))
      ORDER BY fixtime ASC;
    `;

    const startQuery = new StartQueryExecutionCommand({
      QueryString: queryString,
      QueryExecutionContext: { Database: process.env.ATHENA_DATABASE_NAME },
      ResultConfiguration: { OutputLocation: process.env.ATHENA_OUTPUT_LOCATION },
    });

    const { QueryExecutionId } = await athenaClient.send(startQuery);

    let state = "QUEUED";
    let attempts = 0;
    const maxAttempts = 120; 

    while (["RUNNING", "QUEUED"].includes(state)) {
      if (attempts >= maxAttempts) throw new Error("Athena export timeout");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;

      const execution = await athenaClient.send(
        new GetQueryExecutionCommand({ QueryExecutionId })
      );
      state = execution.QueryExecution.Status.State;

      if (state === "FAILED" || state === "CANCELLED") {
        throw new Error(`Export failed: ${execution.QueryExecution.Status.StateChangeReason}`);
      }
    }

    const s3Url = new URL(process.env.ATHENA_OUTPUT_LOCATION);
    const bucketName = s3Url.hostname;
    let prefix = s3Url.pathname.substring(1);
    if (prefix && !prefix.endsWith('/')) prefix += '/';

    const objectKey = `${prefix}${QueryExecutionId}.csv`;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return { downloadUrl };

  } catch (err) {
    console.error("❌ Export Error:", err.message);
    throw err;
  }
};