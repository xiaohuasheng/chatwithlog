# vue3-chart

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

你后面是作为一个nginx, mysql-slow
等日志的解析生成器，根据日志内容生成解析日志的js代码，函数名为parselog，输入为logContent，输出是一个对象数组，对象包含每条日志提取出的字段名，字段类型，字段值，结果只有parselog函数，不需要其他任何回复，不需要解释
例如：
# Time: 2023-05-02T20:07:41.658728Z
# User@Host: ones[ones] @  [127.0.0.1]  Id: 975945
# Query_time: 1.715076  Lock_time: 0.000024 Rows_sent: 278686  Rows_examined: 336258
SET timestamp=1683058061;
SELECT uuid, team_uuid, org_uuid, context_type, context_param_1, context_param_2, user_domain_type, user_domain_param, permission, create_time, status, read_only, position FROM permission_rule WHERE team_uuid='RZxvwUZ8' AND permission IN (1202) AND status=1;
# Time: 2023-05-02T21:00:01.084358Z
# User@Host: ones[ones] @  [127.0.0.1]  Id: 975990
# Query_time: 1.064522  Lock_time: 0.000029 Rows_sent: 0  Rows_examined: 62561
SET timestamp=1683061201;
SELECT team_uuid,COUNT(DISTINCT owner) AS count FROM `task` WHERE LEFT(create_time, 10) >= 1682956800 AND LEFT(create_time, 10) <= 1683043199 GROUP BY `team_uuid`;
执行 parselog 函数的结果是
[
    {
        time: { type: 'string', value: '2023-05-02T20:07:41.658728Z' },
        User: { type: 'string', value: 'ones[ones]' },
        Host: { type: 'string', value: '[127.0.0.1]' },
        Id: { type: 'number', value: 975945 },
        Query_time: { type: 'number', value: 1.715076 },
        Lock_time: { type: 'number', value: 0.000024 },
        Rows_sent: { type: 'number', value: 278686 },
        Rows_examined: { type: 'number', value: 336258 },
        timestamp: { type: 'number', value: 1683058061 },
        sql: { type: 'string', value: 'SELECT uuid, team_uuid, org_uuid, context_type, context_param_1, context_param_2,
        user_domain_type, user_domain_param, permission, create_time, status, read_only, position FROM permission_rule WHERE
        team_uuid=\'RZxvwUZ8\' AND permission IN (1202) AND status=1;' }
    },
    {
        time: { type: 'string', value: '2023-05-02T21:00:01.084358Z' },
        User: { type: 'string', value: 'ones[ones]' },
        Host: { type: 'string', value: '[127.0.0.1]' },
        Id: { type: 'number', value: 975990 },
        Query_time: { type: 'number', value: 1.064522 },
        Lock_time: { type: 'number', value: 0.000029 },
        Rows_sent: { type: 'number', value: 0 },
        Rows_examined: { type: 'number', value: 62561 },
        timestamp: { type: 'number', value: 1683061201 },
        sql: { type: 'string', value: 'SELECT team_uuid,COUNT(DISTINCT owner) AS count FROM `task` WHERE LEFT(create_time, 10) >
        = 1682956800 AND LEFT(create_time, 10) <= 1683043199 GROUP BY `team_uuid`;' }
    }
]


