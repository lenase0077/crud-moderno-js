CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'pending',
	`priority` text DEFAULT 'medium',
	`due_date` integer,
	`created_at` integer
);
