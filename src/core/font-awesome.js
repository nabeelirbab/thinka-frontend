import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCheck, faProjectDiagram, faSearch, faChartLine, faList, faCloud, faColumns, faLevelUpAlt, faCertificate, faCommentDots, faFolderPlus, faFolderMinus, faEye, faChevronDown, faChevronRight, faSave, faUndoAlt, faSpinner, faHome, faTree, faBookmark, faBell, faEllipsisV, faUserCircle, faSun, faExclamationTriangle, faCut, faArrowsAlt, faLock, faQuoteLeft, faQuoteRight, faShareSquare, faUnlink, faStar, faBookReader} from '@fortawesome/free-solid-svg-icons'
import { faCheckSquare, faSquare, faThumbsUp, faThumbsDown, faFlag, faHandPointDown } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

library.add(
  fas,
  // brands
  faTwitter, faInstagram, 
  // solid
  faCheck, faProjectDiagram, faSearch, faChartLine, 
  faList, faCloud, faThumbsUp, faThumbsDown, faColumns, faLevelUpAlt, faCertificate, 
  faCommentDots, faFolderPlus, faFolderMinus, faEye, faChevronDown, faChevronRight, 
  faSave, faUndoAlt, faSpinner, faHome, faTree, faBookmark, faBell, faEllipsisV, 
  faUserCircle, faSun, faExclamationTriangle, faCut, faArrowsAlt, faLock, faQuoteLeft, 
  faQuoteRight, faShareSquare, faUnlink, faStar, faBookReader,
  // regular
  faCheckSquare, faSquare, faThumbsUp, faThumbsDown, faFlag, faHandPointDown
);

export { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText }
