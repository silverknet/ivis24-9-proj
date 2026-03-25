var points = 0;
<Script>
function increasePoints() {
    points += 1}
</Script>

function DantesTesting(){
    return (
        <header>
            <button onClick={() => increasePoints()}>+1 points</button>
            <p>Points: {points}</p>
        </header>
    );
}
export default DantesTesting;