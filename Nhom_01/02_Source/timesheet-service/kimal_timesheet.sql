---------------------- Truncate data of all tables ----------------------
DO $$
BEGIN
    EXECUTE (
        SELECT 'TRUNCATE TABLE ' || string_agg(format('%I.%I', schemaname, tablename), ', ') || ' CASCADE'
        FROM pg_tables
        WHERE schemaname = 'public'
    );
END $$;

INSERT INTO public.timesheets VALUES (20, 'Description about your task here', '2025-05-31 15:16:46.499', '2025-05-31 15:16:48.356', 1, 'auth0|67d99257463a53ee93784bb3', '2025-05-31 15:16:46.499', '2025-05-31 15:16:48.357', NULL, 'stopped', NULL, 160, 129, 155, 'PROCESSING'),
(24, 'Description about your task here', '2025-05-30 03:17:15.175', '2025-05-30 08:17:17.435', 18000, 'auth0|67d99257463a53ee93784bb3', '2025-05-30 15:17:15.175', '2025-05-30 15:17:30.555', NULL, 'stopped', NULL, 160, 129, 155, 'APPROVED'),
(21, 'Description about your task here', '2025-05-22 08:16:53.922', '2025-05-22 15:16:55.627', 25200, 'auth0|67d99257463a53ee93784bb3', '2025-04-22 15:16:53.922', '2025-04-22 15:17:32.738', NULL, 'stopped', NULL, 158, 127, 153, 'APPROVED'),
(23, 'Description about your task here', '2025-05-29 01:00:06.869', '2025-05-29 10:17:09.614', 32400, 'auth0|67d99257463a53ee93784bb3', '2025-05-29 15:17:06.869', '2025-05-29 15:17:35.222', NULL, 'stopped', NULL, 156, 129, 151, 'APPROVED'),
(19, 'Description about your task here', '2025-05-28 02:36:39.708', '2025-05-28 07:16:41.747', 18000, 'auth0|67d99257463a53ee93784bb3', '2025-05-28 11:16:39.708', '2025-05-28 15:17:37.496', NULL, 'stopped', NULL, 159, 123, 154, 'APPROVED'),
(16, 'Description about your task here', '2025-05-31 15:16:15.551', '2025-05-31 15:16:18.743', 3, 'auth0|67d99257463a53ee93784bb3', '2025-05-31 07:16:15.551', '2025-05-31 15:17:39.447', NULL, 'stopped', NULL, 152, 121, 158, 'APPROVED'),
(18, 'Description about your task here', '2025-05-27 03:11:30.423', '2025-05-27 07:16:32.556', 14400, 'auth0|67d99257463a53ee93784bb3', '2025-05-27 11:26:30.423', '2025-05-27 15:17:42.023', NULL, 'stopped', NULL, 150, 127, 156, 'APPROVED'),
(17, 'Description about your task here', '2025-05-31 15:16:23.385', '2025-05-31 15:16:25.083', 1, 'auth0|67d99257463a53ee93784bb3', '2025-05-31 10:00:23.385', '2025-05-31 15:17:47.142', NULL, 'stopped', NULL, 151, 123, 157, 'APPROVED'),
(22, 'Description about your task here', '2025-05-26 02:45:00.145', '2025-05-26 10:30:02.415', 18800, 'auth0|67d99257463a53ee93784bb3', '2025-05-26 15:17:00.145', '2025-05-26 15:17:49.403', NULL, 'stopped', NULL, 157, 122, 152, 'APPROVED'),
(15, 'Description about your task here', '2025-05-25 01:24:01.696', '2025-05-25 08:16:09.453', 25500, 'auth0|67d99257463a53ee93784bb3', '2025-05-25 07:55:01.696', '2025-05-25 15:17:52.846', NULL, 'stopped', NULL, 153, 127, 159, 'APPROVED'),
(14, 'Description about your task here', '2025-05-31 15:15:45.16', '2025-05-31 15:15:55.742', 10, 'auth0|67d99257463a53ee93784bb3', '2025-05-31 09:45:45.16', '2025-05-31 15:18:04.184', NULL, 'stopped', NULL, 154, 121, 160, 'APPROVED');
 