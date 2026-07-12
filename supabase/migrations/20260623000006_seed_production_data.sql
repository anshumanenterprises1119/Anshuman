-- Seed Production Data: Phase 4 Requirements

-- 1. Ensure Brands exist
insert into public.brands (id, name, slug, domain) values
('a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Anshuman Enterprises', 'anshuman-enterprises', 'anshumanenterprises.online'),
('f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'FutureWithAi', 'futurewithai', 'futurewithai.online')
on conflict (id) do update set
    name = excluded.name,
    slug = excluded.slug,
    domain = excluded.domain;

-- 2. Seed Category List
insert into public.categories (id, brand_id, name, slug, created_at) values
-- Physical categories (Anshuman)
('c101b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Modular Switches', 'modular-switches', now()),
('c102b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Wires & Cables', 'wires-cables', now()),
('c103b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'LED Lighting', 'led-lighting', now()),
('c104b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'CCTV & Security', 'cctv-security', now()),
('c105b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Conduit & Hardware', 'conduit-hardware', now()),
-- Digital categories (FutureWithAi)
('c201a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'n8n Automation', 'n8n-automation', now()),
('c202a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'PHP scripts', 'php-scripts', now()),
('c203a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'SaaS Boilerplates', 'saas-boilerplates', now()),
('c204a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'Prompt Blueprints', 'prompt-blueprints', now())
on conflict (id) do update set
    name = excluded.name,
    slug = excluded.slug;

-- 3. Seed First 20 Products (10 Physical, 10 Digital)
insert into public.products (id, brand_id, name, slug, sku, base_price, type, is_active, created_at) values
-- Physical (Anshuman)
('p101b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Premium COB Ceiling Light 12W', 'premium-cob-ceiling-light-12w', 'AE-COB-LED-01', 1200.00, 'physical', true, now()),
('p102b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Polycab FR House Wire 1.5 sq mm', 'polycab-fr-house-wire-1.5-sq-mm', 'AE-POL-FR-15', 1800.00, 'physical', true, now()),
('p103b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'KEI FRLS House Wire 2.5 sq mm', 'kei-frls-house-wire-2.5-sq-mm', 'AE-KEI-FRLS-25', 2800.00, 'physical', true, now()),
('p104b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Havells Crabtree Modular Switch (Graphite)', 'havells-crabtree-modular-switch-graphite', 'AE-HAV-CS-06', 120.00, 'physical', true, now()),
('p105b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Legrand Myrius 6A 2-Way Switch', 'legrand-myrius-6a-2-way-switch', 'AE-LEG-MY-2W', 150.00, 'physical', true, now()),
('p106b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Orient LED Batten Lamp 20W', 'orient-led-batten-lamp-20w', 'AE-ORI-BAT-20', 350.00, 'physical', true, now()),
('p107b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'CP Plus HD Dome Camera 2MP', 'cp-plus-hd-dome-camera-2mp', 'AE-CPP-DOM-02', 1850.00, 'physical', true, now()),
('p108b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Schneider Acti9 16A SP MCB', 'schneider-acti9-16a-sp-mcb', 'AE-SCH-MCB-16', 450.00, 'physical', true, now()),
('p109b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'PVC Conduit Pipe 25mm (Medium)', 'pvc-conduit-pipe-25mm-medium', 'AE-PVC-CON-25', 60.00, 'physical', true, now()),
('p110b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Fingerprint Smart Door Lock (CONA)', 'fingerprint-smart-door-lock-cona', 'AE-CON-SDL-01', 12500.00, 'physical', true, now()),

-- Digital (FutureWithAi)
('p201b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'Ultimate n8n AI Automation Pack', 'ultimate-n8n-ai-pack', 'FWAI-N8N-AI-PACK', 349.00, 'digital', true, now()),
('p202b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', '400+ PHP Manually Tested Scripts', 'php-web-scripts-bundle', 'FWAI-PHP-SCRIPTS', 499.00, 'digital', true, now()),
('p203b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'Ultimate Web Applications Bundle', 'themes-plugins-ultimate', 'FWAI-WEB-APPS', 999.00, 'digital', true, now()),
('p204b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'Emergent Prompt Engineering Blueprint', 'emergent-prompt-engineering', 'FWAI-PROMPT-ENG', 199.00, 'digital', true, now()),
('p205b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'NodeJS SaaS Boilerplate & Auth Template', 'nodejs-saas-boilerplate', 'FWAI-NODE-SAAS', 799.00, 'digital', true, now()),
('p206b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'Python Autonomous Agent Scraper Suite', 'python-agent-scraper', 'FWAI-PY-SCRAPE', 399.00, 'digital', true, now()),
('p207b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'Next.js Portfolio Tailwind Theme', 'nextjs-portfolio-theme', 'FWAI-NEXT-PORT', 299.00, 'digital', true, now()),
('p208b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'WordPress WooCommerce Automation Plugin', 'wp-woocommerce-automation', 'FWAI-WP-WOO', 599.00, 'digital', true, now()),
('p209b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'n8n Lead Generation Pipeline Template', 'n8n-lead-generation-pipeline', 'FWAI-N8N-LEAD', 249.00, 'digital', true, now()),
('p210b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'PHP Database backup Automation Script', 'php-db-backup-automation', 'FWAI-PHP-BACKUP', 149.00, 'digital', true, now())
on conflict (id) do update set
    name = excluded.name,
    sku = excluded.sku,
    base_price = excluded.base_price,
    type = excluded.type;

-- 4. Seed Categories Mapping Table (if page categories matches)
-- 5. Seed Inventory for physical products
insert into public.inventory (product_id, quantity, reserved, low_stock_threshold) values
('p101b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 45, 0, 5),
('p102b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 28, 0, 5),
('p103b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 3, 0, 5), -- Low stock warning trigger
('p104b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 150, 0, 10),
('p105b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 85, 0, 10),
('p106b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 60, 0, 5),
('p107b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 14, 0, 2),
('p108b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 35, 0, 5),
('p109b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 200, 0, 20),
('p110b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 2, 0, 3) -- Low stock warning trigger
on conflict (product_id) do update set
    quantity = excluded.quantity,
    low_stock_threshold = excluded.low_stock_threshold;

-- 6. Seed Digital Assets keys for digital products
insert into public.digital_assets (id, product_id, file_path, file_name, file_size) values
('p201b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'p201b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'cloudflare-r2/vault/downloads/ultimate-n8n-ai-pack.zip', 'ultimate-n8n-ai-pack.zip', 15728640),
('p202b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'p202b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'cloudflare-r2/vault/downloads/php-web-scripts-bundle.zip', 'php-web-scripts-bundle.zip', 52428800),
('p203b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'p203b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'cloudflare-r2/vault/downloads/themes-plugins-ultimate.zip', 'themes-plugins-ultimate.zip', 104857600),
('p204b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'p204b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'cloudflare-r2/vault/downloads/emergent-prompt-engineering.zip', 'emergent-prompt-engineering.zip', 1048576),
('p205b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'p205b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'cloudflare-r2/vault/downloads/nodejs-saas-boilerplate.zip', 'nodejs-saas-boilerplate.zip', 5242880),
('p206b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'p206b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'cloudflare-r2/vault/downloads/python-agent-scraper.zip', 'python-agent-scraper.zip', 2097152),
('p207b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'p207b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'cloudflare-r2/vault/downloads/nextjs-portfolio-theme.zip', 'nextjs-portfolio-theme.zip', 8388608),
('p208b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'p208b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'cloudflare-r2/vault/downloads/wp-woocommerce-automation.zip', 'wp-woocommerce-automation.zip', 4194304),
('p209b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'p209b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'cloudflare-r2/vault/downloads/n8n-lead-generation-pipeline.zip', 'n8n-lead-generation-pipeline.zip', 12582912),
('p210b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'p210b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'cloudflare-r2/vault/downloads/php-db-backup-automation.zip', 'php-db-backup-automation.zip', 524288)
on conflict (id) do update set
    file_path = excluded.file_path,
    file_name = excluded.file_name,
    file_size = excluded.file_size;

-- 7. Seed Product Attributes
insert into public.product_attributes (product_id, name, value) values
('p101b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Wattage', '12W'),
('p101b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Certification', 'ISI Standard'),
('p102b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Length', '90 Meters'),
('p102b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Conductor', 'Copper'),
('p110b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Access Mode', 'Fingerprint, App, Passcode'),
('p201b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Platform', 'n8n self-hosted / cloud'),
('p201b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Nodes', 'LLM Agent, Webhook, Sheet DB'),
('p202b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Language', 'PHP 8.x compatible')
on conflict do nothing;

-- 8. Seed Hero Content
insert into public.hero_content (id, brand_id, title, subtitle, cta_text, cta_link, image_url) values
('h101b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'a782b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'Wholesale Electrical Supplies & Products', 'Direct sourcing from India''s top manufacturers. Genuine products at the best market pricing. We supply hardware and commercial electrical contracting services.', 'Explore Products', '#featured', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780'),
('h102b1c6-2c5e-4029-9a2e-c1e1bc89a74a', 'f8c3a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', 'Supercharge Your Business with AI Automations', 'Unlock premium n8n automation workflows, pre-tested PHP micro-apps, code templates, and ultimate web application themes. Protected vault delivery.', 'Explore Templates', '/futurewithai/products', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31')
on conflict (id) do update set
    title = excluded.title,
    subtitle = excluded.subtitle,
    cta_text = excluded.cta_text,
    cta_link = excluded.cta_link;
