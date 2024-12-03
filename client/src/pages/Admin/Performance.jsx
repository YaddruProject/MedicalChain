import { useEffect, useCallback } from "react";
import { Row, Col, Card, Spin, message } from "antd";
import { Line } from "@ant-design/plots";

import ContentLayout from "@components/ContentLayout";
import useCustomState from "@hooks/useCustomState";
import apiClient from "@services/api";

const Performance = () => {
  const [state, updateState] = useCustomState({
    throughputData: [],
    latencyData: [],
    isLoading: true,
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      const [throughputResponse, latencyResponse] = await Promise.all([
        apiClient.get("/analytics/throughput"),
        apiClient.get("/analytics/latency"),
      ]);
      const throughputData = throughputResponse.data.map((item) => ({
        time: item.time,
        value: item.value,
      }));
      const latencyData = latencyResponse.data.map((item) => ({
        time: item.time,
        value: item.value,
      }));
      updateState({ throughputData, latencyData, isLoading: false });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      message.error("Failed to load performance data");
      updateState({ isLoading: false });
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const throughputConfig = {
    data: state.throughputData,
    xField: "time",
    yField: "value",
    smooth: true,
    height: 300,
    point: {
      sizeField: 5,
      shapeField: "circle",
    },
  };

  const latencyConfig = {
    data: state.latencyData,
    xField: "time",
    yField: "value",
    smooth: true,
    height: 300,
    point: {
      sizeField: 5,
      shapeField: "circle",
    },
  };

  return (
    <ContentLayout>
      <Col span={24}>
        {state.isLoading ? (
          <Spin size="large" fullscreen={true} />
        ) : (
          <Row gutter={[16, 24]}>
            <Col span={24}>
              <Card title="Throughput Over Time" bordered>
                <Line {...throughputConfig} />
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Latency Over Time" bordered>
                <Line {...latencyConfig} />
              </Card>
            </Col>
          </Row>
        )}
      </Col>
    </ContentLayout>
  );
};

export default Performance;
