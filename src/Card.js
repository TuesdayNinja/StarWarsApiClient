import React from "react";
import styled from "styled-components";

const CardWrapper = styled.div`
  box-shadow: 0px 0px 8px rgba(255,255,255,0.1);
  padding: 2em;
  margin: 2em;
  width: 200px;
  height: 150px;
  background-color: rgba(0, 0, 0, 0.80);

`;


const Planet = styled.h2`
  color: white;
  margin-bottom: 0.2em;
`;

const Diameter = styled.h4`
  margin: 0.2em 0 1.3em 0;
`;

const Species = styled.p`
`;

const Link = styled.a`
 cursor: pointer;
  &:hover {
    color: purple;
  }
`;

export default class Card extends React.Component {
  render() {
    const {planet, species, showSpecies} = this.props;
    return (
      <CardWrapper>
        <Planet>{planet.name}</Planet>
        <Diameter>Diameter {planet.diameter} km</Diameter>
        <Species> Species: {species.map((s) => {return <Link onClick={() => showSpecies(s)} key={s.name}>{s.name}</Link>})} </Species>
      </CardWrapper>
    )
  }
}