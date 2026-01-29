import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login';
import RegisterPage from '../pages/register/register';
import StoriesPage from '../pages/stories/stories-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import Dashboard from '../pages/dashboard/dashboard';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/stories': new StoriesPage(),
  '/add-story': new AddStoryPage(),
  '/dashboard': Dashboard,
};


export default routes;
