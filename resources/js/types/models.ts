export type ProductCategory =
    | 'Paket Lebaran'
    | 'Paket Kantor'
    | 'Natal & Tahun Baru'
    | 'Wedding'
    | 'Custom'
    | 'Ramadan & Eid';

export interface Product {
    id: number;
    name: string;
    slug: string;
    category: ProductCategory | string;
    packaging?: string;
    is_halal?: boolean;
    is_featured_hero?: boolean;
    visibility?: string;
    short_description: string;
    contents: string[];
    price_from: number;
    corporate_price?: number;
    event_tag?: string | null;
    formatted_price: string;
    formatted_corporate_price?: string;
    image: string | null;
    images?: string[] | null;
    sort_order: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Order {
    id: number;
    order_number: string;
    user_id: number;
    order_type: 'personal' | 'corporate';
    company_name?: string | null;
    recipient_name: string;
    recipient_phone: string;
    shipping_address: string;
    city?: string | null;
    postal_code?: string | null;
    needed_at?: string | null;
    greeting_card_text?: string | null;
    engraving_name?: string | null;
    total_quantity: number;
    subtotal: number;
    shipping_cost: number;
    total_amount: number;
    formatted_total?: string;
    payment_status: 'unpaid' | 'paid';
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    tracking_number?: string | null;
    shipping_courier?: string | null;
    shipping_status:
        | 'studio_processing'
        | 'quality_check'
        | 'in_delivery'
        | 'delivered';
    customer_notes?: string | null;
    admin_notes?: string | null;
    items?: OrderItem[];
    tracking_logs?: TrackingLogItem[];
    created_at?: string;
    updated_at?: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id?: number | null;
    product_name: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
    formatted_unit_price?: string;
    formatted_subtotal?: string;
    product?: Product;
}

export interface TrackingLogItem {
    id: number;
    order_id?: number;
    stage:
        | 'studio_processing'
        | 'quality_check'
        | 'in_delivery'
        | 'delivered'
        | string;
    title: string;
    description?: string | null;
    location?: string | null;
    logged_at: string;
}

export type TrackingLog = TrackingLogItem;

export interface Review {
    id: number;
    user_id?: number;
    order_id?: number | null;
    product_id?: number | null;
    customer_name: string;
    customer_title?: string | null;
    rating: number;
    comment: string;
    likes_count: number;
    is_published?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ReviewItem {
    id: number;
    name: string;
    role?: string;
    orderType?: string;
    quote: string;
    rating: number;
    likesCount: number;
    createdAt?: string;
}

export interface Inquiry {
    id: number;
    name: string;
    company_name?: string | null;
    email: string;
    whatsapp_number: string;
    estimated_packages: string;
    budget_per_package?: string | number | null;
    needed_at?: string | null;
    notes?: string | null;
    status?: 'new' | 'contacted' | 'completed' | 'cancelled';
    admin_notes?: string | null;
    created_at?: string;
    updated_at?: string;
}
