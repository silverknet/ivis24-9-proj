import { useState } from "react";

function DantesTesting(){
    const [points, setPoints] = useState(0);

    function increasePoints() {
        setPoints(points + 1);
    }

    return (
        <header>
            <button onClick={() => increasePoints()}>+1 points</button>
            <p>Points: {points}</p>
        </header>
    );
}
export default DantesTesting;