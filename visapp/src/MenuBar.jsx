function MenuBar(){
    return (
        <div className="MenuContainer">
            <div className="LogoContainer">
                <div className="Logo"><h1>C02vis</h1></div>
            </div>
            <div className="ItemContainer">
                <div className="Item" onClick={(d)=>{return 0}}><p>About</p></div>
                <div className="Item"><p>How to use</p></div>
            </div>
        </div>
    );
}
export default MenuBar;