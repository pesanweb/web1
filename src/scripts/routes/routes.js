import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login';
import RegisterPage from '../pages/register/register';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
};


export default routes;
