import styled from "styled-components";
import { useEffect, useState } from "react";
import CONST from "../utils/CONST";
import { Timer } from "../utils/context";
import { timerToString } from "../utils/helpers";

const Table = styled.div`
  display: table;
  width: 100%;
  border-collapse: collapse;
`;

const HeaderRow = styled.div`
  display: table-row;
  background-color: #ddd;
`;

const Row = styled.div<{odd?: string}>`
  display: table-row;
  background-color: ${({ odd }) => (odd === 'true' ? '#f3f3f3' : 'white')};
`;

const Cell = styled.div`
  display: table-cell;
  padding: 10px;
  // border: 1px solid #ccc;
  text-align: left;
`;

const WorkHistory = () => {
  const [completedTimers, setCompletedTimers] = useState<Timer[] | null>(null);

  useEffect(() => {
    const timersStr = localStorage.getItem(CONST.StorageKeys.COMPLETED_TIMERS);
    if (timersStr) setCompletedTimers(JSON.parse(timersStr));
  }, []);

  return (
    <>
      <Table>
        <HeaderRow>
          <Cell><strong>No</strong></Cell>
          <Cell><strong>Timer</strong></Cell>
          <Cell><strong>Description</strong></Cell>
          <Cell></Cell>
        </HeaderRow>
        {
          completedTimers ? (
            completedTimers.map((timer, index) => (
              <Row key={timer.id} odd={(index % 2 !== 0).toString()}>
                <Cell>{index + 1}</Cell>
                <Cell>{timerToString(timer)}</Cell>
                <Cell>{timer.description}</Cell>
                <Cell></Cell>
              </Row>
            ))
          ) : (
            <div>
              Nothing to show
            </div>
          )
        }
      </Table>
    </>
  );
};

export default WorkHistory;
