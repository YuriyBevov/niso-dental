import Swiper from "swiper";
import { Navigation, Pagination, Thumbs } from "swiper/modules";

// Регистрируем нужные модули глобально
Swiper.use([Navigation, Pagination, Thumbs]);
// Экспортируем для внешнего использования
window.Swiper = Swiper;
