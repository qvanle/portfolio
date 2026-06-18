import type { SitePost } from './posts';

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

interface SitePostCopy {
	title: string;
	excerpt: string;
	body?: string[];
}

interface SiteLanguageCopy {
	nav: NavCopy;
	home: HomeCopy;
	insights: InsightsCopy;
	drawer: DrawerCopy;
	controls: ControlsCopy;
	posts: Record<string, SitePostCopy>;
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
				prefix: 'A place for ',
				strong: 'building',
				middle: ', ',
				accent: 'sharing knowledge',
				suffix: ', and giving back.',
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
		posts: {
			'scoping-automation-before-building': {
				title: 'How I scope automation before I build it',
				excerpt:
					'A simple checklist I use to keep repetitive work honest, measurable, and worth automating.',
			},
			'cost-of-manual-repetition': {
				title: 'The cost of manual repetition in small teams',
				excerpt:
					'Why tiny inefficiencies matter once they are repeated across a whole engineering org.',
			},
			'building-tools-for-myself-first': {
				title: 'Building tools for myself first',
				excerpt:
					'A practical rule that keeps product decisions grounded in actual usage.',
			},
			'what-rotexai-should-save-people-from': {
				title: 'What I want RotexAI to save people from',
				excerpt:
					'The class of tasks I think should disappear from a modern workflow stack.',
			},
			'calmer-way-to-think-about-workflow-design': {
				title: 'A calmer way to think about workflow design',
				excerpt:
					'Less ceremony, fewer steps, and a clearer path from input to result.',
			},
			'why-i-still-write-implementation-notes': {
				title: 'Why I still write implementation notes',
				excerpt:
					'Short notes keep decisions recoverable when context disappears later.',
			},
			'how-i-choose-when-not-to-automate': {
				title: 'How I choose when not to automate something',
				excerpt:
					'Automation is only worth it when the result is easier to trust than the manual path.',
			},
			'designing-for-busy-first-time-users': {
				title: 'Designing for first-time users who are busy',
				excerpt:
					'Small interfaces work best when they explain themselves without ceremony.',
			},
			'parts-of-a-workflow-that-should-stay-visible': {
				title: 'The parts of a workflow that should stay visible',
				excerpt:
					'Visibility is what lets people trust a system they are about to rely on.',
			},
			'open-source-tools-that-should-be-boring': {
				title: 'Open-source tools that should be boring to use',
				excerpt:
					'The best utilities disappear into the work instead of asking for attention.',
			},
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
		posts: {
			'scoping-automation-before-building': {
				title: 'Tôi xác định phạm vi tự động hóa trước khi bắt đầu như thế nào',
				excerpt:
					'Một checklist đơn giản tôi dùng để giữ cho công việc lặp lại trở nên rõ ràng, đo được, và đáng để tự động hóa.',
			},
			'cost-of-manual-repetition': {
				title: 'Chi phí của sự lặp lại thủ công trong các nhóm nhỏ',
				excerpt:
					'Vì sao những bất hiệu quả nhỏ cũng trở nên đáng kể khi chúng lặp lại trên cả một tổ chức kỹ thuật.',
			},
			'building-tools-for-myself-first': {
				title: 'Xây công cụ cho chính mình trước',
				excerpt:
					'Một nguyên tắc thực tế giúp các quyết định sản phẩm bám sát cách sử dụng thật.',
			},
			'what-rotexai-should-save-people-from': {
				title: 'Tôi muốn RotexAI giúp mọi người thoát khỏi điều gì',
				excerpt:
					'Những dạng công việc lẽ ra nên biến mất khỏi một quy trình làm việc hiện đại.',
			},
			'calmer-way-to-think-about-workflow-design': {
				title: 'Một cách bình tĩnh hơn để nghĩ về thiết kế quy trình',
				excerpt:
					'Ít hình thức hơn, ít bước hơn, và một đường đi rõ ràng hơn từ đầu vào tới kết quả.',
			},
			'why-i-still-write-implementation-notes': {
				title: 'Vì sao tôi vẫn viết ghi chú triển khai',
				excerpt:
					'Những ghi chú ngắn giúp các quyết định vẫn có thể truy lại khi ngữ cảnh đã mất đi.',
			},
			'how-i-choose-when-not-to-automate': {
				title: 'Tôi chọn không tự động hóa một thứ như thế nào',
				excerpt:
					'Tự động hóa chỉ đáng làm khi kết quả tạo ra dễ tin hơn so với cách làm thủ công.',
			},
			'designing-for-busy-first-time-users': {
				title: 'Thiết kế cho người dùng lần đầu nhưng đang bận',
				excerpt:
					'Giao diện nhỏ gọn hoạt động tốt nhất khi tự giải thích được mà không cần quá nhiều lời.',
			},
			'parts-of-a-workflow-that-should-stay-visible': {
				title: 'Những phần của quy trình cần được giữ cho nhìn thấy',
				excerpt:
					'Khả năng quan sát là điều giúp người dùng tin vào một hệ thống họ sắp phụ thuộc.',
			},
			'open-source-tools-that-should-be-boring': {
				title: 'Công cụ mã nguồn mở nên đủ “boring” để dùng',
				excerpt:
					'Những tiện ích tốt nhất sẽ biến mất vào công việc thay vì đòi hỏi sự chú ý.',
			},
		},
	},
};

export function getSiteCopy(language: Language) {
	return siteCopy[language];
}

export function localizePosts(
	posts: SitePost[],
	language: Language,
): SitePost[] {
	const postCopy = siteCopy[language].posts;

	return posts.map((post) => {
		const localized = postCopy[post.slug];

		if (!localized) {
			return post;
		}

		return {
			...post,
			title: localized.title,
			excerpt: localized.excerpt,
			...(localized.body ? { body: localized.body } : {}),
		};
	});
}
