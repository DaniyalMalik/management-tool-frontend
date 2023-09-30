// board
export const DELETE_BOARD = 'deleteBoard';
export const UPDATE_BOARD_PATCH = 'updateBoardPatch';
export const UPDATE_BOARD_PUT = 'updateBoardPut';
export const VALIDATION_ERROR_BOARD = 'validationErrorBoard';
export const ADD_BOARD = 'addBoard';
export const POST_REQUEST_BOARD = 'postRequestBoard';
export const ERROR_BOARD = 'errorBoard';
export const GET_BOARD_BY_ID = 'getBoardById';
export const GET_BOARDS = 'getBoards';
export const GET_BOARDS_COUNT = 'getBoardsCount';
export const MAKE_REQUEST_BOARD = 'makeRequestBoard';

// list
export const MAKE_REQUEST_LIST = 'makeRequestList';
export const GET_LISTS = 'getLists';
export const ERROR_LIST = 'errorList';
export const GET_LIST_BY_ID = 'getListById';
export const POST_REQUEST_LIST = 'postRequestList';
export const ADD_LIST = 'addList';
export const VALIDATION_ERROR_LIST = 'validationErrorList';
export const BULK_UPDATE_LIST = 'bulkUpdateList';
export const UPDATE_LIST = 'updateList';
export const UPDATE_LIST_PUT = 'updateListPut';
export const DELETE_LIST = 'deleteList';

// card
export const MAKE_REQUEST_CARD = 'makeRequestCard';
export const GET_CARDS = 'getCards';
export const GET_CARD_BY_ID = 'getCardById';
export const GET_TASKS_BY_CARD_ID = 'getTasksByCardId';
export const ERROR_CARD = 'errorCard';
export const POST_REQUEST_CARD = 'postRequestCard';
export const ADD_CARD = 'addCard';
export const VALIDATION_ERROR_CARD = 'validationErrorCard';
export const BULK_UPDATE_CARD = 'bulkUpdateCard';
export const UPDATE_CARD_PATCH = 'updateCardPatch';
export const UPDATE_CARD_PUT = 'updateCardPut';
export const DELETE_CARD = 'deleteCard';

// user
export const GET_USERS = 'getUsers';
export const GET_USERS_COUNT = 'getUsersCount';
export const GET_USERS_BY_EMPLOY_ID = 'getUsersByEmployId';
export const UPDATE_USER = 'updateUser';
export const UPDATE_LOGGEDIN_USER = 'updateLoggedInUser';
export const UPDATE_USER_PASSWORD = 'updateUserPassword';
export const USER_REQUEST = 'userRequest';
export const ADD_USER = 'addUser';
export const GET_USER = 'getUser';
export const GET_SINGLE_USER = 'getSingleUser';
export const ERROR_USER = 'errorUser';
export const LOGOUT_USER = 'logoutUser';
export const DELETE_USER = 'deleteUser';

// archive
export const UPDATE_ARCHIVE = 'updateArchive';
export const GET_ARCHIVES = 'getArchives';
export const GET_SINGLE_ARCHIVE = 'getSingleArchive';
export const POST_ARCHIVE = 'postArchive';
export const DELETE_ARCHIVE = 'deleteArchive';

// meeting
export const UPDATE_MEETING = 'updateMeeting';
export const GET_MEETINGS = 'getMeetings';
export const GET_SINGLE_MEETING = 'getSingleMeeting';
export const POST_MEETING = 'postMeeting';
export const DELETE_MEETING = 'deleteMeeting';

// notification
export const GET_NOTIFICATIONS = 'getNotifications';
export const POST_NOTIFICATION = 'postNotifications';
export const PUT_NOTIFICATION = 'putNotifications';
export const DELETE_NOTIFICATION = 'deleteNotification';

// activity
export const VALIDATION_ERROR_ACTIVITY = 'validationErrorActivity';
export const ERROR_ACTIVITY = 'errorActivity';
export const DELETE_ACTIVITY = 'deleteActivity';
export const GET_ACTIVITIES = 'getActivities';
export const ADD_ACTIVITY = 'addActivity';

// task
export const MAKE_REQUEST_TASK = 'makeRequestTask';
export const GET_TASKS = 'getTasks';
export const GET_TASK_BY_ID = 'getTaskById';
export const GET_TASK_BY_USER_ID = 'getTaskByUserId';
export const POST_REQUEST_TASK = 'postRequestTask';
export const ERROR_TASK = 'errorTask';
export const ADD_TASK = 'addTask';
export const VALIDATION_ERROR_TASK = 'validationErrorTask';
export const UPDATE_TASK = 'updateTask';
export const DELETE_TASK = 'deleteTask';

// token
export const TOKEN_REQUEST = 'tokenRequest';
export const TOKEN_RESPONSE = 'tokenResponse';
export const TOKEN_RESPONSE_ERROR = 'tokenResponseError';

// login
export const LOGIN_FAILED = 'loginFailed';
export const LOGIN_SUCCESS = 'loginSuccess';
export const LOGIN_REQUEST = 'loginRequest';

// register
export const REGISTER_FAILED = 'registerFailed';
export const REGISTER_SUCCESS = 'registerSuccess';
export const REGISTER_REQUEST = 'registerRequest';

// cv builder
export const MIGRATE_SECTION = 'migrateSection';
export const ADD_ITEM = 'addItem';
export const DELETE_ITEM = 'deleteItem';
export const MOVE_ITEM_UP = 'moveItemUp';
export const MOVE_ITEM_DOWN = 'moveItemDown';
export const ON_INPUT = 'onInput';
export const SAVE_DATA = 'saveData';
export const IMPORT_DATA = 'importData';
export const LOAD_DEMO_DATA = 'loadDemoData';
export const RESET = 'reset';

// page
export const SET_PAGE_REF = 'setPageRef';
export const SET_PAN_ZOOM_REF = 'setPanZoomRef';
export const SET_PRINT_DIALOG_OPEN = 'setPrintDialogOpen';

// company
export const CREATE_COMPANY = 'createCompany';
export const UPDATE_COMPANY = 'updateCompany';
export const DELETE_COMPANY = 'deleteCompany';
export const GET_COMPANY = 'getCompany';
export const GET_COMPANIES = 'getCompanies';
export const GET_COMPANIES_BY_OWNER = 'getCompaniesByOwner';

// favourite
export const ADD_TO_FAVOURITE = 'addToFavourite';
export const REMOVE_FROM_FAVOURITE = 'removeFromFavourite';
export const GET_SINGLE_FROM_FAVOURITE = 'getSingleFromFavourite';
export const GET_MANY_FROM_FAVOURITE = 'getManyFromFavourite';

// pie chart
export const CREATE_PIE_CHART = 'createPieChart';
export const UPDATE_PIE_CHART = 'updatePieChart';
export const DELETE_PIE_CHART = 'deletePieChart';
export const GET_PIE_CHART = 'getPieChart';

// todo list
export const CREATE_TODO_ITEM = 'createTodoItem';
export const UPDATE_TODO_ITEM = 'updateTodoItem';
export const DELETE_TODO_ITEM = 'deleteTodoItem';
export const GET_TODO_ITEMS = 'getTodoItems';
export const GET_TODO_ITEM = 'getTodoItem';

// comment
export const ADD_COMMENT = 'addComment';
export const GET_COMMENTS = 'getComments';

// snackbar
export const OPEN_SNACKBAR = 'openSnackbar';
export const CLOSE_SNACKBAR = 'closeSnackbar';

// loader
export const OPEN_LOADER = 'openLoader';
export const CLOSE_LOADER = 'closeLoader';

// private messages
export const POST_MESSAGE = 'postMessage';
export const GET_CONVERSATIONS = 'getConversations';
export const GET_MESSAGES = 'getMessages';
export const UPDATE_CONVERSATION = 'updateConversation';

// group messages
export const POST_GROUP = 'postGroup';
export const POST_GROUP_MESSAGE = 'postGroupMessage';
export const GET_GROUP_MESSAGES = 'getGroupMessages';
export const UPDATE_GROUP_CONVERSATION = 'updateGroupConversation';
export const GET_GROUP_CONVERSATIONS = 'getGroupConversations';
