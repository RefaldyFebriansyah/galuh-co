export type ProductCategory =
    | 'Lebaran'
    | 'Natal'
    | 'Corporate'
    | 'Wedding'
    | 'Custom';

export interface Product {
    id: number;
    name: string;
    slug: string;
    category: ProductCategory;
    short_description: string;
    contents: string[];
    price_from: number;
    formatted_price: string;
    image: string;
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
    budget_per_package?: string | null;
    needed_at?: string | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}
