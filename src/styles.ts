import styled from "styled-components";

export const Centered = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
`;
export const BottomMenu = styled(Centered)`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #efefef;
  padding: 18px 6px 6px;
  box-sizing: border-box;
`;
export const PageTitle = styled.div`
  font-family: Helvetica;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 12px;
  color: #666;
`;
