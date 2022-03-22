process.env.SOCKET_PATH = process.env.PORT;
delete process.env.PORT;

import('./build/index.js');
