import {initContext} from '/imports/configs/context';
import routes from '/imports/configs/routes.jsx';
import {createApp} from '/imports/libs/mantra';

import coreModule from '/imports/modules/core';

const context = initContext();

const app = createApp(context);
app.loadModule(coreModule);
app.loadRoutes(routes);
