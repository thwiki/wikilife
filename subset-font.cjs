const subsetFont = require('subset-font');
const path = require('path');
const fs = require('fs');
const del = require('del');
const makeDir = require('make-dir');

const langFont = {
	zh: fs.readFileSync('./fonts/ZCOOL_KuaiLe-Regular.ttf'),
	en: fs.readFileSync('./fonts/Sriracha-Regular.ttf'),
	zs: fs.readFileSync('./fonts/Zazer_Square.otf'),
};

const distDir = './public/assets/fonts';
const distMap = './src/lib/i18n/index.ts';

del.sync(distDir);
makeDir.sync(distDir);

/**
 * @type {Record<string, { zh?: string, en?: string, zs?: string }>}
 */
const texts = {
	CodeTitle: {
		en: '==',
	},
	CodeOpenTemplate: {
		en: '{{',
	},
	CodeCloseTemplate: {
		en: '}}',
	},

	GreaterThan: {
		en: '>',
	},
	LessThan: {
		en: '<',
	},
	Equal: {
		en: '=',
	},
	Colon: {
		zh: '：',
		en: ': ',
	},
	OpenBracket: {
		zh: '（',
		en: '(',
	},
	CloseBracket: {
		zh: '）',
		en: ')',
	},

	Zh: {
		zh: '中',
	},
	En: {
		en: 'EN',
	},
	Author: {
		zh: '制作',
		en: 'Author',
	},
	Materials: {
		zh: '使用素材',
		en: 'Materials',
	},
	SourceCode: {
		zh: '源码',
		en: 'Source Code',
	},
	Login: {
		zh: '登录以获取成就',
		en: 'Login to Claim Achievements',
	},
	Start: {
		zh: '开始',
		en: 'Start',
	},
	BackWiki: {
		zh: '回到维基',
		en: 'Back to Wiki',
	},
	Task: {
		zh: '任务',
		en: 'Task',
	},
	TaskList: {
		zh: '任务列表',
		en: 'Task List',
	},
	Completed: {
		zh: '已完成',
		en: 'Completed',
	},
	Unknown: {
		zh: '未知',
		en: 'Unknown',
	},
	Level: {
		zh: '等级',
		en: 'Level',
	},
	Contribute: {
		zh: '贡献',
		en: 'Contribute',
	},
	Contribution: {
		zh: '贡献',
		en: 'Contr.',
	},
	NewLife: {
		zh: '新生',
		en: 'New Life',
	},
	AvailableTask: {
		zh: '可用任务',
		en: 'Available Tasks',
	},
	NewAvailableTask: {
		zh: '新增可用任务',
		en: 'New Available Tasks',
	},
	None: {
		zh: '无',
		en: 'None',
	},
	LevelUp: {
		zh: '贡献升级',
		en: 'Level Up',
	},
	Level0: {
		zh: '初出茅庐',
		en: 'Level 0',
	},
	Level1: {
		zh: '小有成就',
		en: 'Level 1',
	},
	Level2: {
		zh: '游刃有余',
		en: 'Level 2',
	},
	Level3: {
		zh: '大显身手',
		en: 'Level 3',
	},
	LevelStory0: {
		zh: '你是一名新生的维基编辑者，你怀着一颗为社群奉献的心来到这个世界。坚信可以让你发光发热，你初次踏入了维基。这里的事物对你来说都很陌生，你可以做的事情也很有限，但你相信你的热情可以帮助你解决任何难题，目标自然是成为维基大师！',
		en: 'You are a newly-born Wiki Editor who came into this world with a heart dedicated to the community. Believing it will make you shine, you step into the Wiki for the first time. Things here are very strange to you, and what you can do is limited, but you believe that your enthusiasm can help you solve any problems, and your goal is naturally to become a Wiki Master!',
	},
	LevelStory1: {
		zh: '经过一番奋斗，你用非凡的天赋向众人证明了自己。你不懈的努力亦打动了上层的人，他们相信你的能力，并希望对你委以重任。你在心中默默念道，大家都十分支持我，现在我已经不再是孤军奋战的了，我必须加倍努力，回馈社群。',
		en: 'After a lot of struggle, you have proved yourself to everyone with your extraordinary talent. Your unremitting efforts have also impressed the upper-levels. They believe in your ability and hope to entrust you with important responsibilities. You silently said in your heart, now that everyone is supporting me, I must redouble my efforts and give back to the community.',
	},
	LevelStory2: {
		zh: '愈发复杂的任务，似乎根本难不倒你。曾经的懵懂小伙已经不复存在，现在这里的只有一位受人景仰的管理员。初次参与人事相关的事务，你惶恐地意识到自己以后将会担起培育新编辑的责任，现在社群的未来就掌握在你手上了。',
		en: 'The increasingly complex tasks seem to be difficult for you at all. The former ignorant rookie no longer exists, and now there is only an admired administrator. Involved in personnel matters for the first time, you realize with fear that you will be responsible for nurturing new editors in the future, and now the future of the community is in your hands.',
	},
	LevelStory3: {
		zh: '你认为你离成为维基大师的目标还有多远？也许每个人的答案都不一样，但你心里很清楚，社群仍然有很多不完善的地方，维基依然有很多需要大量时间投入的无底深坑……你意识到你的大师之路才刚刚开始，指向相信更好的未来！',
		en: 'How close do you think you are to becoming a Wiki Master? Maybe everyone’s answer is different, but you know very well that the community still has many imperfections, and the Wiki still has many bottomless pits... You realize that your road to mastery has only just begun, pointing to believe in a better future!',
	},
	SaveError: {
		zh: '存档错误',
		en: 'Save Error',
	},
	ClearSave: {
		zh: '清除存档',
		en: 'Delete Save',
	},

	CreatePage: {
		zh: '创建词条',
		en: 'Create Article',
	},
	UploadCover: {
		zh: '上传封面图片',
		en: 'Upload Cover Image',
	},
	FixOrder: {
		zh: '整理词条段落',
		en: 'Organize Article',
	},
	FixCode: {
		zh: '修复不匹配括号',
		en: 'Fix Parentheses',
	},

	CaptureSpell: {
		zh: '制作符卡截图',
		en: 'Capture Spell Card',
	},
	InputManga: {
		zh: '录入漫画文字',
		en: 'Input Manga',
	},
	ReplyTalk: {
		zh: '回复讨论',
		en: 'Reply Talk',
	},
	DeleteProblem: {
		zh: '巡查更改',
		en: 'Patrol Changes',
	},

	DeleteComment: {
		zh: '巡查用户评论',
		en: 'Patrol Comments',
	},
	CloseTalk: {
		zh: '结束讨论',
		en: 'End Talk',
	},
	RunJob: {
		zh: '处理后台任务',
		en: 'Run Background Jobs',
	},
	PromoteUser: {
		zh: '晋升用户',
		en: 'Promote User',
	},

	Create: {
		zh: '创建',
		en: 'Create',
	},
	Edit: {
		zh: '编辑',
		en: 'Edit',
	},
	Upload: {
		zh: '上传',
		en: 'Upload',
	},
	UploadFile: {
		zh: '上传文件',
		en: 'Upload File',
	},
	SelectFile: {
		zh: '选择文件',
		en: 'Select File',
	},
	Talk: {
		zh: '讨论',
		en: 'Talks',
	},
	Comment: {
		zh: '评论',
		en: 'Comments',
	},
	ReportedComment: {
		zh: '被举报评论',
		en: 'Reported Comments',
	},
	RecentChange: {
		zh: '最近更改',
		en: 'Recent Changes',
	},
	Job: {
		zh: '后台任务',
		en: 'Background Jobs',
	},
	Reference: {
		zh: '参考资料',
		en: 'References',
	},
	UserInfo: {
		zh: '用户资料',
		en: 'User Info',
	},
	ApproveCriteria: {
		zh: '批准条件',
		en: 'Approve Criteria',
	},
	Source: {
		zh: '素材',
		en: 'Sources',
	},
	Code: {
		zh: '代码',
		en: 'Codes',
	},
	Manga: {
		zh: '漫画',
		en: 'Manga',
	},
	Guideline: {
		zh: '规范',
		en: 'Guidelines',
	},
	Reset: {
		zh: '重置',
		en: 'Reset',
	},
	Save: {
		zh: '保存',
		en: 'Save',
	},
	Delete: {
		zh: '删除',
		en: 'Delete',
	},
	Reply: {
		zh: '回复',
		en: 'Reply',
	},
	Waiting: {
		zh: '等待中',
		en: 'Waiting',
	},
	Later: {
		zh: '请稍候再回来',
		en: 'Please Come Back Later',
	},
	Awaiting: {
		zh: '待运行',
		en: 'Awaiting',
	},
	Run: {
		zh: '运行',
		en: 'Run',
	},
	Start: {
		zh: '开始',
		en: 'Start',
	},
	Capture: {
		zh: '截图',
		en: 'Capture',
	},
	Reject: {
		zh: '拒绝',
		en: 'Reject',
	},
	Approve: {
		zh: '批准',
		en: 'Approve',
	},

	Z01: { zs: 'A' },
	Z02: { zs: 'B' },
	Z03: { zs: 'C' },
	Z04: { zs: 'D' },
	Z05: { zs: 'E' },
	Z06: { zs: 'F' },
	Z07: { zs: 'G' },
	Z08: { zs: 'H' },
	Z09: { zs: 'I' },
	Z10: { zs: 'J' },
	Z11: { zs: 'K' },
	Z12: { zs: 'L' },
	Z13: { zs: 'M' },
};

const langMap = {};

const langText = {
	zh: '',
	en: '1234567890+-?',
	zs: '',
};

function toKebab(string) {
	return [...string].map((letter, index) => (/[A-Z]/.test(letter) ? `${index === 0 ? '' : '-'}${letter.toLowerCase()}` : letter)).join('');
}

for (const [key, langs] of Object.entries(texts)) {
	const keyMap = {
		zh: '',
		en: '',
		zs: '',
	};
	langMap[toKebab(key)] = keyMap;

	for (const lang in langs) {
		if (Object.hasOwnProperty.call(langs, lang)) {
			const text = langs[lang];

			langText[lang] += text;
			keyMap[lang] = text;
		}
	}
}

fs.writeFileSync(
	distMap,
	`export const i18n = ${JSON.stringify(langMap, undefined, '\t')} as const;
export type I18NKey = keyof typeof i18n;
export type I18NLang = keyof (typeof i18n)[I18NKey];
`,
	'utf-8',
);

(async () => {
	for (const lang in langText) {
		if (Object.hasOwnProperty.call(langText, lang)) {
			{
				const subsetBuffer = await subsetFont(langFont[lang], langText[lang], {
					targetFormat: 'woff2',
				});
				fs.writeFileSync(path.join(distDir, `${lang}.woff2`), subsetBuffer);
			}
			{
				const subsetBuffer = await subsetFont(langFont[lang], langText[lang], {
					targetFormat: 'woff',
				});
				fs.writeFileSync(path.join(distDir, `${lang}.woff`), subsetBuffer);
			}
			{
				const subsetBuffer = await subsetFont(langFont[lang], langText[lang], {
					targetFormat: 'sfnt',
				});
				fs.writeFileSync(path.join(distDir, `${lang}.ttf`), subsetBuffer);
			}
		}
	}
})();
