import React, { useState, useReducer, useEffect, useContext } from "react";
import { useSpring, animated, config } from "react-spring";
import styled from "styled-components";

const AppWrapper = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 100vh;
  background: #e2e8f0;
`;

const Title = styled.h1`
  background: #00b5d8;
  color: #fff;
  margin: 0px;
  padding: 0.85em 0;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

const BoxAreaContainer = styled.section`
  background: #9decf9;
  border: 4px solid #00b5d8;
  border-radius: 8px;
  flex-grow: 1;
  margin: 4px;
`;

const StyledBox = styled(animated.div)`
  display: inline-block;
  border-radius: 8px;
  font-weight: 500;
  font-size: 20px;
  padding: 5px;
  overflow: hidden;
  margin: 4px;
`;

const AnimatedBox = ({ boxProps, springProps, children }) => {
  const { x, y, w, h } = boxProps;
  const style = useSpring({
    transform: `translate(${x}px, ${y}px)`,
    background: `#38a169`,
    width: `${w}px`,
    height: `${h}px`,
    config: {
      ...config.default,
      ...springProps
    }
  });

  useEffect(() => {
    console.log(`Box resized to width ${w}px and height ${h}px`);
  }, [w, h]);

  return <StyledBox style={style}>{children}</StyledBox>;
};

const SettingsAreaContainer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const SettingBoxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-basis: 50%;
  align-items: center;
  padding: 0.35em 1.75em;
  max-height: 80px;
  background: #e2e8f0;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
`;

const SettingBoxTitle = styled.p`
  flex-grow: 1;
  flex-shrink: 1;
  font-size: 1.125em;
`;

const SettingBoxRangeInput = styled.input`
  width: 40%;
  margin: 0 1em;
`;

const SettingBoxNumberInput = styled.input`
  width: 60px;
  padding: 1px;
  margin: 0;
  font-size: 1em;
`;

function SettingBox({ title, settingKey }) {
  const [store, dispatch] = useContext(AppContext);
  const settingValue = store[settingKey];
  const [lastNumberInput, setLastNumberInput] = useState(settingValue || 500);

  const handleChange = (value) => {
    dispatch({
      type: "CHANGE_VALUE",
      value: value,
      key: settingKey
    });
  };

  return (
    <SettingBoxWrapper>
      <SettingBoxTitle>{title}</SettingBoxTitle>
      <SettingBoxRangeInput
        type="range"
        value={settingValue}
        max={lastNumberInput}
        onChange={(e) => handleChange(e.target.value)}
      />
      <SettingBoxNumberInput
        type="number"
        value={settingValue}
        max={lastNumberInput}
        onChange={(e) => {
          const value = e.target.value;
          handleChange(value);
          setLastNumberInput(value);
        }}
      />
    </SettingBoxWrapper>
  );
}

const ButtonAreaContainer = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const StyledButton = styled.button`
  padding: 0.5em;
  background: #00b5d8;
  cursor: pointer;
  color: #fff;
  display: inline-block;
  border: none;
  width: 10em;
  font-size: 1.2em;
  border-radius: 4px;
  outline: none;
  margin: 8px 0;

  &:active {
    background: #76e4f7;
  }
`;

const initialState = {
  width: 300,
  height: 50,
  xOffset: 0,
  yOffset: 0,
  mass: 1,
  tension: 170,
  friction: 26,
  precision: 0.01,
  velocity: 0
};

const computeStoreValues = (state) => ({
  ...state,
  boxProps: {
    w: state.width,
    h: state.height,
    x: state.xOffset,
    y: state.yOffset
  },
  springProps: {
    mass: state.mass,
    tension: state.tension,
    friction: state.friction,
    precision: state.precision,
    velocity: state.velocity
  }
});

const storeReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_VALUE":
      return {
        ...state,
        [action.key]: action.value
      };

    case "UPDATE_BOX":
      return computeStoreValues(state);

    case "RANDOMIZE_BOX":
      return {
        ...state,
        width: Math.round(Math.random() * 200 + 1),
        height: Math.round(Math.random() * 200 + 1),
        xOffset: Math.round(Math.random() * 400 + 1),
        yOffset: Math.round(Math.random() * 400 + 1)
      };

    default:
      throw new Error("Unknown store action type");
  }
};

export const AppContext = React.createContext();

export default function App() {
  const [store, dispatch] = useReducer(
    storeReducer,
    initialState,
    computeStoreValues
  );

  const boxText = "I am an animated box! I am really fun!";

  return (
    <AppContext.Provider value={[store, dispatch]}>
      <AppWrapper>
        <Title>Change the box properties!</Title>
        <SettingsAreaContainer>
          <SettingBox title="Box's Width" settingKey="width" />
          <SettingBox title="Box's Height" settingKey="height" />
          <SettingBox title="Box's X offset" settingKey="xOffset" />
          <SettingBox title="Box's Y offset" settingKey="yOffset" />
          <SettingBox title="Spring's Mass" settingKey="mass" />
          <SettingBox title="Spring's Tension" settingKey="tension" />
          <SettingBox title="Spring's Friction" settingKey="friction" />
          <SettingBox title="Spring's Precision" settingKey="precision" />
          <SettingBox title="Spring's Velocity" settingKey="velocity" />
        </SettingsAreaContainer>
        <ButtonAreaContainer>
          <StyledButton onClick={() => dispatch({ type: "UPDATE_BOX" })}>
            Commit changes
          </StyledButton>
          <StyledButton onClick={() => dispatch({ type: "RANDOMIZE_BOX" })}>
            Randomize box
          </StyledButton>
        </ButtonAreaContainer>

        <BoxAreaContainer>
          <AnimatedBox
            boxProps={store.boxProps}
            springProps={store.springProps}
          >
            {boxText}
          </AnimatedBox>
        </BoxAreaContainer>
      </AppWrapper>
    </AppContext.Provider>
  );
}
