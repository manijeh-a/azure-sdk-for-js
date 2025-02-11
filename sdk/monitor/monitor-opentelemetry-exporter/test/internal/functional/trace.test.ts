// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { assertCount, assertTraceExpectation } from "../../utils/assert";
import { TraceBasicScenario } from "../../utils/basic";
import { DEFAULT_BREEZE_ENDPOINT } from "../../../src/Declarations/Constants";
import nock from "nock";
import { successfulBreezeResponse } from "../../utils/breezeTestUtils";
import { TelemetryItem as Envelope } from "../../../src/generated";

describe("Trace Exporter Scenarios", () => {
  describe(TraceBasicScenario.prototype.constructor.name, () => {
    const scenario = new TraceBasicScenario();
    let ingest: Envelope[] = [];

    before(() => {
      nock(DEFAULT_BREEZE_ENDPOINT)
        .post("/v2.1/track", (body: Envelope[]) => {
          // todo: gzip is not supported by generated applicationInsightsClient
          // const buffer = gunzipSync(Buffer.from(body, "hex"));
          // ingest.push(...(JSON.parse(buffer.toString("utf8")) as Envelope[]));
          ingest.push(...body);
          return true;
        })
        .reply(200, successfulBreezeResponse(1))
        .persist();
      scenario.prepare();
    });

    after(() => {
      scenario.cleanup();
      nock.cleanAll();
      ingest = [];
    });

    it("should work", (done) => {
      scenario
        .run()
        .then(() => {
          // promisify doesn't work on this, so use callbacks/done for now
          // eslint-disable-next-line promise/always-return
          return scenario.flush().then(() => {
            assertTraceExpectation(ingest, scenario.expectation);
            assertCount(ingest, scenario.expectation);
            done();
          });
        })
        .catch((e) => {
          done(e);
        });
    });
  });

  describe(`${TraceBasicScenario.prototype.constructor.name} with disabled OTel Resource Metric`, () => {
    const scenario = new TraceBasicScenario();
    let ingest: Envelope[] = [];

    before(() => {
      process.env.ENV_OPENTELEMETRY_RESOURCE_METRIC_DISABLED = "true";
      nock(DEFAULT_BREEZE_ENDPOINT)
        .post("/v2.1/track", (body: Envelope[]) => {
          // todo: gzip is not supported by generated applicationInsightsClient
          // const buffer = gunzipSync(Buffer.from(body, "hex"));
          // ingest.push(...(JSON.parse(buffer.toString("utf8")) as Envelope[]));
          ingest.push(...body);
          return true;
        })
        .reply(200, successfulBreezeResponse(1))
        .persist();
      scenario.prepare();
    });

    after(() => {
      scenario.cleanup();
      nock.cleanAll();
      ingest = [];
    });

    it("should work with OTel resource metric disabled", (done) => {
      scenario
        .run()
        .then(() => {
          // promisify doesn't work on this, so use callbacks/done for now
          // eslint-disable-next-line promise/always-return
          return scenario.flush().then(() => {
            assertTraceExpectation(ingest, scenario.disabledExpectation);
            assertCount(ingest, scenario.disabledExpectation);
            done();
          });
        })
        .catch((e) => {
          done(e);
        });
    });
  });
});
