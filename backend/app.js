import express from "express";
import cors from "cors";
import {
  AthenaClient,
  StartQueryExecutionCommand,
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
} from "@aws-sdk/client-athena";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const athenaClient = new AthenaClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.post("/data", async (req, res) => {
  try {
    const { tractorId, startDate, endDate } = req.body;
    if (!tractorId) return res.status(400).json({ error: "tractorId is required" });
    let tId = String(tractorId).trim();
    tId = tId.replace(/'/g, "''");
    const queryString = `
      SELECT
        accId,
        accountId,
        contact,
        course,
        deviceId,
        deviceTime,
        devicetags,
        disabled,
        fixTime,
        lastupdate,
        latitude,
        longitude,
        model,
        name,
        speed,
        state,
        statesince,
        staticField,
        type,
        uniqueid,
        valid,
        p_date,
        p_hour,
        attributes.alarm,
        attributes.batOta,
        attributes.batOva,
        attributes.batUva,
        attributes.battCurrent,
        attributes.battEnergy,
        attributes.battVoltage,
        attributes.battery,
        attributes.canBusStatus,
        attributes.cellVoltDiff,
        attributes.charDischarState,
        attributes.chargeCycleCount,
        attributes.chargeTime,
        attributes.contFault,
        attributes.contOca,
        attributes.controllerTemp,
        attributes.dischargeCycleCount,
        attributes.distToEmpty,
        attributes.fwVersion,
        attributes.ignition,
        attributes.iotVoltage,
        attributes.maxCellVoltage,
        attributes.minCellVoltage,
        attributes.motion,
        attributes.motorFault,
        attributes.motorSpeed,
        attributes.motorTemp,
        attributes.odoCan,
        attributes.odokm,
        attributes.odometer,
        attributes.power,
        attributes.protection,
        attributes.ratedCapacity,
        attributes.regenFlag,
        attributes.rssi,
        attributes.rstRsn,
        attributes.sat,
        attributes.soc,
        attributes.soh,
        attributes.speed,
        attributes.thermRa,
        attributes.timeToDischarge,
        attributes.totRst
      FROM tractor_data_optimized 
      WHERE p_date BETWEEN '${startDate}' AND '${endDate}'
        AND lower(trim(name)) = lower(trim('${tId}'))
      ORDER BY fixtime ASC;
    `;
    const startQuery = new StartQueryExecutionCommand({
      QueryString: queryString,
      QueryExecutionContext: {
        Database: process.env.ATHENA_DATABASE_NAME
      },
      ResultConfiguration: {
        OutputLocation: process.env.ATHENA_OUTPUT_LOCATION
      }
    });

    const queryResponse = await athenaClient.send(startQuery);
    const queryExecutionId = queryResponse.QueryExecutionId;
    let state = "RUNNING";
    while (state === "RUNNING" || state === "QUEUED") {
      const getExecution = new GetQueryExecutionCommand({
        QueryExecutionId: queryExecutionId
      });
      const executionResult = await athenaClient.send(getExecution);

      state = executionResult.QueryExecution.Status.State;

      if (state === "FAILED") {
        console.error("❌ Athena execution failed:", executionResult.QueryExecution.Status);
        return res.status(500).json({ error: "Athena query failed" });
      }

      if (state === "SUCCEEDED") break;

      await new Promise((r) => setTimeout(r, 1000));
    }
    const desiredLimit = 20;
    let rowsCollected = [];
    let nextToken = undefined;

    do {
      const pageResult = await athenaClient.send(
        new GetQueryResultsCommand({
          QueryExecutionId: queryExecutionId,
          NextToken: nextToken,
          MaxResults: 1000 
        })
      );
      const columns = pageResult.ResultSet.ResultSetMetadata.ColumnInfo.map(
        (col) => col.Name
      );
      const isFirstPage = !nextToken;
      const pageRows = (pageResult.ResultSet.Rows || []).slice(isFirstPage ? 1 : 0);

      for (const row of pageRows) {
        const obj = {};
        (row.Data || []).forEach((val, idx) => {
          obj[columns[idx]] = val && val.VarCharValue !== undefined ? val.VarCharValue : null;
        });

        rowsCollected.push(obj);
        if (rowsCollected.length >= desiredLimit) break;
      }

      if (rowsCollected.length >= desiredLimit) break;

      nextToken = pageResult.NextToken;
    } while (nextToken);

    const finalRows = rowsCollected.slice(0, desiredLimit);
    
    return res.json(finalRows);
  } catch (err) {
    // console.error("❌ Error fetching data:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});



app.get("/vehicle", async (req, res) => {
    const { tractorId } = req.query;
    if (!tractorId) {
        return res.status(400).json({ error: "tractorId is required" });
    }
    const moonriderURL = `https://backend-prod.moonrider.ai/iniesta/sse/subscribe/?name=${tractorId}`;

    try {
        const response = await fetch(moonriderURL, {
            headers: { 'Accept': 'text/event-stream' }
        });

        if (!response.ok || !response.body) {
            const status = response ? response.status : 'No Status';
            const statusText = response ? response.statusText : 'Unknown Error';
            return res.status(500).json({ 
                error: `Failed to connect to Moonrider. Status: ${status} ${statusText}` 
            });
        }

        let rawData = "";
        const decoder = new TextDecoder('utf-8');
        let done = false;

        const reader = response.body.getReader();

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;

            if (value) {
                const chunkStr = decoder.decode(value, { stream: !done });
                rawData += chunkStr;

                
                if (rawData.includes("data:")) {
                    break; 
                }
            }
        }
        
      
        reader.cancel(); 

       
        const jsonLine = rawData
            .split("\n")
            .find((line) => line.startsWith("data:"));

        const jsonString = jsonLine?.replace(/^data: ?/, "").trim(); 

        const parsedData = JSON.parse(jsonString || "{}");

        res.status(200).json([parsedData]);

    } catch (err) {
        res.status(500).json({ error: `Internal SSE fetch error: ${err.message}` });
    }
});
const PORT = process.env.PORT || 6000;

app.listen(PORT, "0.0.0.0", () => {
});



