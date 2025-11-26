import { useGaugeState } from '@mui/x-charts/Gauge';
import { useSpring, animated, to } from '@react-spring/web';

function GaugePointer() {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();
    const { angle } = useSpring({
        to: { angle: valueAngle ?? 0 },
        config: { tension: 120, friction: 14 },
    });

    if (valueAngle === null) {
        return null;
    }

    return (
        <g>
            <circle cx={cx} cy={cy} r={5} fill="red" />
            <animated.path
                d={to([angle], (a) => {
                    const targetX = cx + outerRadius * Math.sin(a);
                    const targetY = cy - outerRadius * Math.cos(a);
                    return `M ${cx} ${cy} L ${targetX} ${targetY}`;
                })}
                stroke="red"
                strokeWidth={3}
                strokeLinecap="round"
            />
        </g>
    );
}

export default GaugePointer;