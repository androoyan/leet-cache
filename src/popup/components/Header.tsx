import logo from "../../assets/icons/leet-cache-48x48.png";

const Header = () => {
  return (
    <div id="header" className="header">
      <div id="header-logo" className="header">
        <img src={logo} alt="brain with cache" />
      </div>

      <div id="header-title" className="header">
        <h1>Leet Cache</h1>
      </div>
    </div>
  );
};

export default Header;
