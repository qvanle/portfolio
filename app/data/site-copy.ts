export type Language = 'en' | 'vi';

export interface PageHeadlineParts {
	prefix: string;
	strong: string;
	middle: string;
	accent: string;
	suffix: string;
}

interface NavCopy {
	home: string;
	about: string;
	featured: string;
	latest: string;
	contact: string;
	insight: string;
}

interface HomeCopy {
	eyebrow: string;
	headline: PageHeadlineParts;
	intro: string;
	ctas: {
		insight: string;
		about: string;
	};
	about: {
		title: string;
		paragraphs: [string, string];
	};
	featured: {
		title: string;
		more: string;
	};
	latest: {
		title: string;
		more: string;
	};
	contact: {
		title: string;
		intro: string;
		directLinks: string;
		emailLabel: string;
		namePlaceholder: string;
		emailPlaceholder: string;
		subjectPlaceholder: string;
		messagePlaceholder: string;
		submitLabel: string;
		sending: string;
		successMessage: string;
		errorMessage: string;
	};
}

interface InsightsCopy {
	eyebrow: string;
	title: string;
	intro: string;
	searchPlaceholder: string;
	noResults: string;
	categories: Record<string, string>;
	relatedLabel: string;
}

interface DrawerCopy {
	title: string;
}

interface ControlsCopy {
	navOpenLabel: string;
	themeLabel: string;
	languageLabel: string;
}

interface SiteLanguageCopy {
	nav: NavCopy;
	home: HomeCopy;
	insights: InsightsCopy;
	drawer: DrawerCopy;
	controls: ControlsCopy;
}

export const siteCopy: Record<Language, SiteLanguageCopy> = {
	en: {
		nav: {
			home: 'Home',
			about: 'About Me',
			featured: 'Featured',
			latest: 'Latest',
			contact: 'Get in Touch',
			insight: 'Insight',
		},
		home: {
			eyebrow: 'Hello',
			headline: {
				prefix: '',
				strong: 'Build.',
				middle: ' Learn. ',
				accent: 'Share.',
				suffix: '',
			},
			intro:
				"I'm qvanle, founder of RotexAI, an AI workflow automation platform designed to optimize costs for repetitive tasks. This site is my way of giving back to the tech community that taught me so much.",
			ctas: {
				insight: 'Insight',
				about: 'About Me',
			},
			about: {
				title: 'About Me',
				paragraphs: [
					"I'm qvanle — founder of RotexAI, an AI workflow automation platform aimed at optimizing costs for repetitive tasks. Having learned so much from the tech community over the years, I built this space not just as a portfolio, but to give back and share my knowledge.",
					'I believe everything must revolve around people; tools are meaningless if their goal is not to serve humanity. My rule is simple: before anyone else can use my products, I must be my own first user. This site documents that process through notes on engineering, automation workflows, and the lessons that come with building tools for real use.',
				],
			},
			featured: {
				title: 'Featured',
				more: 'More',
			},
			latest: {
				title: 'Latest',
				more: 'More',
			},
			contact: {
				title: 'Get in Touch',
				intro:
					"If something here helped you, send a note. I'm always open to engineering discussions, automation ideas, and thoughtful feedback.",
				directLinks: 'Direct links',
				emailLabel: 'Email',
				namePlaceholder: 'Your name',
				emailPlaceholder: 'Your email',
				subjectPlaceholder: 'Subject',
				messagePlaceholder: 'Your message…',
				submitLabel: 'Send Message',
				sending: 'Sending…',
				successMessage: "Thanks for reaching out! I'll get back to you soon.",
				errorMessage: 'Something went wrong. Please try again.',
			},
		},
		insights: {
			eyebrow: 'Insight',
			title: 'Writing',
			intro:
				'Notes on engineering, automation workflows, and the decisions behind building RotexAI.',
			searchPlaceholder: 'Search articles...',
			noResults: 'No articles match your search.',
			categories: {
				all: 'All',
				automation: 'Automation',
				product: 'Product',
				workflow: 'Workflow',
				engineering: 'Engineering',
			},
			relatedLabel: 'More to read',
		},
		drawer: {
			title: 'Build, share, and give back.',
		},
		controls: {
			navOpenLabel: 'Open navigation',
			themeLabel: 'Toggle Dark Mode',
			languageLabel: 'Switch language',
		},
	},
	vi: {
		nav: {
			home: 'Trang chủ',
			about: 'Về tôi',
			featured: 'Nổi bật',
			latest: 'Mới nhất',
			contact: 'Liên hệ',
			insight: 'Bài viết',
		},
		home: {
			eyebrow: 'Xin chào',
			headline: {
				prefix: 'Nơi dành cho ',
				strong: 'xây dựng',
				middle: ', ',
				accent: 'chia sẻ kiến thức',
				suffix: ', và đóng góp lại cho cộng đồng.',
			},
			intro:
				'Tôi là qvanle, nhà sáng lập RotexAI, nền tảng tự động hóa quy trình bằng AI giúp tối ưu chi phí cho các tác vụ lặp lại. Trang web này là cách tôi đóng góp lại cho cộng đồng công nghệ đã dạy tôi rất nhiều.',
			ctas: {
				insight: 'Bài viết',
				about: 'Về tôi',
			},
			about: {
				title: 'Về tôi',
				paragraphs: [
					'Tôi là qvanle — nhà sáng lập RotexAI, nền tảng tự động hóa quy trình bằng AI nhằm tối ưu chi phí cho các công việc lặp lại. Sau nhiều năm học hỏi từ cộng đồng công nghệ, tôi xây dựng không gian này không chỉ như một portfolio, mà còn để đóng góp và chia sẻ lại những gì mình biết.',
					'Tôi tin mọi thứ phải xoay quanh con người; công cụ sẽ vô nghĩa nếu mục tiêu cuối cùng của chúng không phải là phục vụ con người. Động lực của tôi là lan tỏa điều tích cực. Sau nhiều năm học tập và làm việc như một kỹ sư, tôi vẫn thấy mọi người phải vật lộn với những công việc thủ công lặp đi lặp lại vốn có thể tự động hóa. Tôi muốn dùng kinh nghiệm của mình để xây những công cụ giúp họ. Nhưng nguyên tắc của tôi rất đơn giản: trước khi ai khác dùng sản phẩm của tôi, tôi phải là người dùng đầu tiên của chính mình. Trang blog này ghi lại hành trình đó, từ việc tạo ra công cụ để giúp bản thân cho tới việc giúp đỡ người khác.',
				],
			},
			featured: {
				title: 'Nổi bật',
				more: 'Xem thêm',
			},
			latest: {
				title: 'Mới nhất',
				more: 'Xem thêm',
			},
			contact: {
				title: 'Liên hệ',
				intro:
					'Nếu có điều gì ở đây hữu ích với bạn, hãy gửi cho tôi một lời nhắn. Tôi luôn sẵn sàng trao đổi về kỹ thuật, ý tưởng tự động hóa, và những góp ý có chiều sâu.',
				directLinks: 'Liên kết trực tiếp',
				emailLabel: 'Email',
				namePlaceholder: 'Tên của bạn',
				emailPlaceholder: 'Email của bạn',
				subjectPlaceholder: 'Chủ đề',
				messagePlaceholder: 'Lời nhắn của bạn…',
				submitLabel: 'Gửi tin nhắn',
				sending: 'Đang gửi…',
				successMessage: 'Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất.',
				errorMessage: 'Đã xảy ra lỗi. Vui lòng thử lại.',
			},
		},
		insights: {
			eyebrow: 'Bài viết',
			title: 'Viết',
			intro:
				'Ghi chú về kỹ thuật, quy trình tự động hóa, và những quyết định đằng sau việc xây dựng RotexAI.',
			searchPlaceholder: 'Tìm bài viết...',
			noResults: 'Không có bài viết phù hợp.',
			categories: {
				all: 'Tất cả',
				automation: 'Tự động hóa',
				product: 'Sản phẩm',
				workflow: 'Quy trình',
				engineering: 'Kỹ thuật',
			},
			relatedLabel: 'Đọc thêm',
		},
		drawer: {
			title: 'Xây dựng, chia sẻ, và đóng góp lại.',
		},
		controls: {
			navOpenLabel: 'Mở điều hướng',
			themeLabel: 'Chuyển chế độ tối',
			languageLabel: 'Đổi ngôn ngữ',
		},
	},
};

export function getSiteCopy(language: Language) {
	return siteCopy[language];
}
