import styled from 'styled-components';

import DocumentComponent from '../components/documentation/DocumentComponent';

import ActionButton from '../components/generic/ActionButton';
import DisplayWindow from '../components/generic/DisplayWindow';
import InputField from '../components/generic/Input';
import Loading from '../components/generic/Loading';

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Title = styled.div`
  font-size: 2rem;
`;

/**
 * You can document your components by using the DocumentComponent component
 */

const noop = () => {};
const bool = true;

const Documentation = () => {
    return (
        <Container>
            <div>
                <Title>Documentation</Title>
                <DocumentComponent
                    title="Loading spinner "
                    component={<Loading size="medium" color="#ffa2bf" />}
                    propDocs={[
                        {
                            prop: 'size',
                            description: 'Changes the size of the loading spinner',
                            type: 'string',
                            defaultValue: 'medium',
                        },
                    ]}
                />
                <DocumentComponent
                    title="Display Window "
                    component={<DisplayWindow time={0} />}
                    propDocs={[
                        {
                            prop: 'time',
                            description: 'Displays the Timer in Min and Sec',
                            type: 'number',
                            defaultValue: '0:00',
                        },
                    ]}
                />
                <DocumentComponent
                    title="Action Button "
                    component={<ActionButton name="Play" onClick={noop} />}
                    propDocs={[
                        {
                            prop: 'Action Button',
                            description: 'Customize Button According to Requirement',
                            type: 'String',
                            defaultValue: 'Blank',
                        },
                    ]}
                />
                <DocumentComponent
                    title="Input Field "
                    component={<InputField value={0} onChange={noop} placeholder="Min:" min={0} disabled={bool} isRunning={bool} />}
                    propDocs={[
                        {
                            prop: 'Input Field',
                            description: 'Customize Input Field for Time',
                            type: 'string',
                            defaultValue: '0',
                        },
                    ]}
                />
            </div>
        </Container>
    );
};

export default Documentation;
