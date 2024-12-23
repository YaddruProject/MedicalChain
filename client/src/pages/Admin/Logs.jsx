import { useEffect, useCallback } from "react";
import { Col, Table, Spin, message, Card } from "antd";

import ContentLayout from "@components/ContentLayout";
import useCustomState from "@hooks/useCustomState";
import useContract from "@hooks/useContract";

const Logs = () => {
  const contract = useContract();
  const [state, updateState] = useCustomState({
    logs: [],
    isLoading: true,
  });

  const fetchLogs = useCallback(async () => {
    try {
      const filters = [
        contract.filters.RoleGranted(),
        contract.filters.RoleRevoked(),
        contract.filters.DoctorRegistered(),
        contract.filters.DoctorRevoked(),
        contract.filters.PatientRegistered(),
        contract.filters.PatientRevoked(),
        contract.filters.NewRecordAdded(),
        contract.filters.AccessGranted(),
        contract.filters.AccessRevoked(),
      ];

      const logPromises = filters.map((filter) => contract.queryFilter(filter, -1000, "latest"));
      const eventLogs = await Promise.all(logPromises);
      const combinedLogs = eventLogs
        .flat()
        .sort((a, b) => b.blockNumber - a.blockNumber)
        .slice(0, 10);
      console.log(combinedLogs);
      const formattedLogs = combinedLogs.map((log, index) => ({
        key: index,
        event: log.fragment.name || "Unknown Event",
        transactionHash: log.transactionHash,
        blockNumber: log.blockNumber,
        args: log.args,
      }));

      updateState({ logs: formattedLogs, isLoading: false });
    } catch (error) {
      console.error("Error fetching logs:", error);
      message.error("Failed to load logs");
      updateState({ isLoading: false });
    }
  }, [contract]);

  useEffect(() => {
    fetchLogs();
  }, [contract, fetchLogs]);

  const columns = [
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
    },
    {
      title: "Transaction Hash",
      dataIndex: "transactionHash",
      key: "transactionHash",
      render: (text) => (
        <a
          href={`https://explorer.buildbear.io/aggressive-hulk-0968b782/tx/${text}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text.substring(0, 20)}...
        </a>
      ),
    },
    {
      title: "Block Number",
      dataIndex: "blockNumber",
      key: "blockNumber",
    },
    {
      title: "Event Data",
      dataIndex: "args",
      key: "args",
      render: (args) =>
        args ? (
          <pre>{JSON.stringify(args, null, 2)}</pre>
        ) : (
          "No additional data"
        ),
    },
  ];

  return (
    <ContentLayout>
      <Col span={24}>
        {state.isLoading ? (
          <Spin size="large" fullscreen={true} />
        ) : (
          <Card title="Latest 10 Transaction Logs">
            <Table
              dataSource={state.logs}
              columns={columns}
              bordered
              pagination={false}
              scroll={{ y: '100vh' }}
            />
          </Card>
        )}
      </Col>
    </ContentLayout>
  );
};

export default Logs;
