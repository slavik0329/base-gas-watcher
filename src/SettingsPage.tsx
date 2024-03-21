import React from "react";
import { BottomMenu, Centered, PageTitle } from "./styles";
import IconButton from "./components/IconButton";
import { IoMdExit } from "react-icons/io";
import styled from "styled-components";
import { chains } from "./chains";
import { useStore } from "./useStore";

type Props = {
  handleCloseSettings: () => void;
};

const Body = styled.div`
  padding: 12px;
`;

const SubTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 20px;
  border-bottom: 1px solid #efefef;
  color: #666;
  padding-bottom: 8px;
`;

const Chains = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
  padding: 8px;
  border: 1px solid #efefef;
  border-radius: 4px;
`;

const Chain = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;

  &:hover {
    font-weight: bold;
  }
`;

export function SettingsPage({ handleCloseSettings }: Props) {
  const selectedChainId = useStore(state => state.selectedChainId);
  const setSelectedChainId = useStore(state => state.setSelectedChainId);

  function setChainId(id: number) {
    const chain = chains[id];

    //@ts-ignore
    window.electron.setChain(chain);
    setSelectedChainId(id);
  }

  return (
    <div>
      <PageTitle>Settings</PageTitle>

      <Body>
        <SubTitle>Chain</SubTitle>

        <Chains>
          {chains.map((chain, i) => (
            <Chain key={chain.name} onClick={() => setChainId(i)}>
              <img src={`/assets/${chain.icon}`} />
              {chain.name}
            </Chain>
          ))}
        </Chains>
      </Body>

      <BottomMenu>
        <IconButton title={"Close Settings"} onClick={handleCloseSettings}>
          <IoMdExit />
        </IconButton>
      </BottomMenu>
    </div>
  );
}
