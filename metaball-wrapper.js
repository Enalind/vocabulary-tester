"use client"
import Metaballs from "./react-metaballs-js/dist";

export default function Metaball(props){
    return <Metaballs
    numMetaballs={props.numMetaballs}
    minRadius={props.minRadius}
    maxRadius={props.maxRadius}
    speed={props.speed}
    colorFrom={props.colorFrom}
    colorTo={props.colorTo}
    backgroundColorFrom={props.backgroundColorFrom}
    backgroundColorTo={props.backgroundColorTo}
    useDevicePixelRatio={true}
    className={props.className}
    />
}