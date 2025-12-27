import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${(props) => props.fullScreen ? '100vh' : '200px'};
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a90e2;
  border-radius: 50%;
  width: ${(props) => props.size || '50px'};
  height: ${(props) => props.size || '50px'};
  animation: ${spin} 1s linear infinite;
`;

const Loader = ({ fullScreen = false, size }) => {
  return (
    <LoaderContainer fullScreen={fullScreen}>
      <Spinner size={size} />
    </LoaderContainer>
  );
};

export default Loader;
