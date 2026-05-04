CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'pending',
	`priority` text DEFAULT 'medium',
	`due_date` integer,
	`parent_id` integer,
	`sort_order` integer DEFAULT 0,
	`created_at` integer
);
