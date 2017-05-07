import React from "react";
import { number, string, shape, func, arrayOf } from "prop-types";
import { provideState, injectState } from "freactal";
import Emojify from "react-emojione";
import styled from "styled-components";
import moment from "moment";

const startTime = moment();

const createEvent = (message, state) => {
  if (!state) {
    return `00:00 : ${message}`;
  }

  const { finland, france } = state;
  const timeNow = moment().diff(startTime);

  return `${moment(timeNow).format("mm:ss")} : ${message} (${france} – ${finland})`;
};

const wrapComponentWithState = provideState({
  initialState: () => ({
    france: 0,
    finland: 0,
    events: [createEvent("Game starts!")],
  }),
  effects: {
    addOneToFrance: () => (state) => {
      const scoreState = {
        ...state,
        france: 1 + state.france,
      };
      const newEvents = [...state.events, createEvent("France scores!", scoreState)];

      return {
        ...scoreState,
        events: newEvents,
      };
    },
    addOneToFinland: () => (state) => {
      const scoreState = {
        ...state,
        finland: 1 + state.finland,
      };
      const newEvents = [...state.events, createEvent("Finland scores!", scoreState)];

      return {
        ...scoreState,
        events: newEvents,
      };
    },
  },
});

const Team = ({ className, flag, name, score }) => (
  <div className={className}>
    <Emojify>{flag}</Emojify>
    <span>{name}</span>
    <span>{score}</span>
  </div>
);

const TeamPropTypes = {
  className: string.isRequired,
  name: string.isRequired,
  flag: string.isRequired,
  score: number.isRequired,
};

Team.propTypes = TeamPropTypes;

const Wrapper = styled.div`
  padding-top: 2rem;
  font-size: 32px;
  background-color: #333;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const StyledTeam = styled(Team)`
  display: flex;
  flex-direction: ${props => props.direction};

  > * {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
`;

const Divider = styled.div`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`;

const Button = styled.button`
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 1rem;
  margin-right: 1rem;
`;

const Parts = styled.div`
  display: flex;
  flex-direction: row;
`;

const Teams = styled(Parts)``;
const Buttons = styled(Parts)``;
const Events = styled(Parts)`
  min-width: 350px;
  margin: 1rem;
  padding: 2rem;
  border: 2px solid white;
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.8rem;
`;

const Event = styled.div``;

const Child = ({
  state: {
    france,
    finland,
    events,
  },
  effects: {
    addOneToFinland,
    addOneToFrance,
  },
}) => (
  <Wrapper>
    <Teams>
      <StyledTeam flag={":flag_fr:"} name={"France"} score={france} />
      <Divider>–</Divider>
      <StyledTeam flag={":flag_fi:"} name={"Finland"} score={finland} direction="row-reverse" />
    </Teams>
    <Buttons>
      <Button onClick={addOneToFrance}>+1 France</Button>
      <Button onClick={addOneToFinland}>+1 Finland</Button>
    </Buttons>
    <Events>
      <b>Events:</b>
      {events.map((event, index) => (
        <Event
          // eslint-disable-next-line
          key={index}
        >
          {event}
        </Event>))}
    </Events>
  </Wrapper>
);

const ChildPropTypes = {
  state: shape({
    finland: number,
    france: number,
    events: arrayOf(string),
  }).isRequired,
  effects: shape({
    addOneToFrance: func,
    addOneToFinland: func,
  }).isRequired,
};

Child.propTypes = ChildPropTypes;

const StatefulChild = wrapComponentWithState(injectState(Child));

const App = () => (
  <div>
    <StatefulChild />
  </div>
);
export default App;
