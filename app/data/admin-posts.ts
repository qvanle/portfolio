export interface AdminTranslation {
	id?: number;
	languages_code: 'en' | 'vi';
	title: string;
	excerpt: string;
	body: string;
}

export interface AdminPostMeta {
	id: string;
	status: 'draft' | 'published' | 'archived';
	slug: string;
	featured: boolean;
	category: string;
	image: string | null;
	date_published: string | null;
	date_created: string;
	date_updated: string;
	translations: AdminTranslation[];
}

export interface PostFormData {
	status: AdminPostMeta['status'];
	slug: string;
	featured: boolean;
	category: string;
	image: string | null;
	date_published: string | null;
	translations: Omit<AdminTranslation, 'id'>[];
}
