import { useNavigate } from 'react-router-dom'; 


function MenuBar(){
    const navigate = useNavigate(); 
    return (
        <div className="MenuContainer">
            <div className="LogoContainer">
                <div className="Logo" onClick={() => navigate('/')}><h1>Green Policy Makers</h1></div>
            </div>
            <div className="ItemContainer">
                <div className="Item" onClick={() => navigate('/about')}><p>About</p></div>
                <div className="Item" onClick={() => navigate('/howtouse')}><p>How to use</p></div>
            </div>
        </div>
    );
}
export default MenuBar;