import styled from "styled-components";

const Container = styled.div`
  display: inline-block;
  cursor: pointer;
  font-family: Helvetica;
  padding: 8px;
  text-align: center;
  color: #666;
  margin-top: -12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  user-select: none;
  position: relative;

  &:hover {
    background-color: #ccc;
  }

  &:active {
    background-color: #aaa;
  }
`;

const Tooltip = styled.div`
  display: none;
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #666;
  color: white;
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;

  ${Container}:hover & {
    display: block;
  }
`;

type Props = {
  onClick?: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function IconButton({ onClick, children, title }: Props) {
  return (
    <Container onClick={onClick}>
      {children}
      {title && <Tooltip>{title}</Tooltip>}
    </Container>
  );
}
