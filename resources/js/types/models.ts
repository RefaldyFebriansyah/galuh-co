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
    category: ProductCategory;
    short_description: string;
    contents: string[];
    price_from: number;
    formatted_price: string;
    image: string | null;
    sort_order: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
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
