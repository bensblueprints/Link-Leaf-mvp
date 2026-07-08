-- Page layout: 'list' (stacked cards, default) or 'grid' (2-up tiles that show
-- each link's uploaded thumbnail).
ALTER TABLE pages ADD COLUMN IF NOT EXISTS layout TEXT NOT NULL DEFAULT 'list';
