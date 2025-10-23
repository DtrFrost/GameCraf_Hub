export default function Header(){
    return(
        <>
        <header>
            <div className="header__logo">
                <a href="#">
                    <img src="" alt="GameCraft.logo" />
                </a>
            </div>
            <div className="header__links">
                <ul>
                    <li><a href="#">Главная</a></li>
                    <li><a href="#">Топ гайды</a></li>
                    <li><a href="#">Конструкторы</a></li>
                    <li><input type="text"/></li>
                    <li><a href="#"><img src="" alt="notifecations"/></a></li>
                    <li>
                        <ul className="profile__links">
                            <li className="links"><a href="#">Мой профиль</a></li>
                            <li className="links"><a href="#">Мои гайды</a></li>
                            <li className="links"><a href="#">Мои сборки</a></li>
                            <li className="links"><a href="#">Избранное</a></li>
                            <li className="links"><a href="#">Выйти</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </header>
        </>
    )
}