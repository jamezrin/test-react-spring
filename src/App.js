import React, { useReducer, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

const StyledBox = styled(animated.div)`
  background: #fc8181;
  display: inline-block;
  padding: 2em;
  border-radius: 8px;
  font-weight: 500;
  font-size: 20px;
  overflow: hidden;
`;

const BoxAreaContainer = styled.div`
  background: rgba(0, 0, 0, 0.925);
  border: 4px solid rgba(0, 0, 0, 1);
  border-radius: 4px;
  height: 50vh;
`;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Title = styled.h1`
  background: #553c9a;
  color: #fff;
  margin: 0px;
  padding: 0.85em 0;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

function Box({ x, y, w, h, children }) {
  const style = useSpring({
    transform: `translate(${x}px, ${y}px)`,
    width: `${w}px`,
    height: `${h}px`
  });

  useEffect(() => {
    console.log(`Width ${w}px, height ${h}px`);
  }, [w, h]);

  return <StyledBox style={style}>{children}</StyledBox>;
}

export default function App() {
  const initialState = {
    width: 300,
    height: 50,
    xOffset: 0,
    yOffset: 0
  };

  const computeStoreValues = (state) => ({
    ...state,
    boxProps: {
      w: state.width,
      h: state.height,
      x: state.xOffset,
      y: state.yOffset
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

      default:
        throw new Error("Unknown store action type");
    }
  };

  const [store, dispatch] = useReducer(
    storeReducer,
    initialState,
    computeStoreValues
  );

  return (
    <AppWrapper>
      <Title>Change the box properties!</Title>

      <div
        style={{
          margin: "4em 0"
        }}
      >
        <section>
          <h2>Width and height</h2>

          <input
            type="range"
            value={store.width}
            onChange={(e) =>
              dispatch({
                type: "CHANGE_VALUE",
                value: e.target.value,
                key: "width"
              })
            }
          />

          <input
            type="range"
            value={store.height}
            onChange={(e) =>
              dispatch({
                type: "CHANGE_VALUE",
                value: e.target.value,
                key: "height"
              })
            }
          />
        </section>

        <section>
          <h2>X and Y offsets</h2>
          <input
            type="range"
            value={store.xOffset}
            onChange={(e) =>
              dispatch({
                type: "CHANGE_VALUE",
                value: e.target.value,
                key: "xOffset"
              })
            }
          />

          <input
            type="range"
            value={store.yOffset}
            onChange={(e) =>
              dispatch({
                type: "CHANGE_VALUE",
                value: e.target.value,
                key: "yOffset"
              })
            }
          />
        </section>

        <button
          style={{
            marginTop: "2em"
          }}
          onClick={() =>
            dispatch({
              type: "UPDATE_BOX"
            })
          }
        >
          Update box!
        </button>
      </div>

      <BoxAreaContainer>
        <Box {...store.boxProps}>I am an animated box! I am really fun!</Box>
      </BoxAreaContainer>
    </AppWrapper>
  );
}
