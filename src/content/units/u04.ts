import type { Unit } from '../types.ts'

const unit: Unit = {
  id: "u04",
  order: 4,
  level: "A2",
  topic: "work",
  title: "My role as a BA lead",
  titleVi: "Vai trò của tôi: trưởng nhóm BA",
  goal: "Giới thiệu vai trò, trách nhiệm và dự án hiện tại của bạn bằng tiếng Anh; phân biệt hiện tại đơn và hiện tại tiếp diễn; dùng đúng 'be responsible for + V-ing'.",
  items: [
    {
      kind: "vocab",
      id: "u04-be-responsible-for",
      term: "be responsible for",
      pos: "phrase",
      vi: "chịu trách nhiệm về",
      def: "to have the job of taking care of something or making sure it happens",
      examples: [
        {
          en: "Our QA team [is responsible for] testing every release.",
          vi: "Nhóm QA của chúng tôi chịu trách nhiệm kiểm thử mọi bản phát hành.",
        },
        {
          en: "Who [is responsible for] cooking dinner in your family?",
          vi: "Trong gia đình bạn, ai là người lo nấu bữa tối?",
        },
        {
          en: "Last year, I [was responsible for] the onboarding of new BAs.",
          vi: "Năm ngoái, tôi phụ trách việc hướng dẫn các BA mới vào làm.",
        },
      ],
      note: "Sau 'for' dùng danh từ hoặc V-ing: responsible for testing. ✗ responsible to test. Nghĩa gần: be in charge of + V-ing.",
    },
    {
      kind: "vocab",
      id: "u04-report-to",
      term: "report to",
      pos: "phrasal verb",
      vi: "báo cáo cho, chịu sự quản lý trực tiếp của",
      def: "to have someone as your direct manager",
      examples: [
        {
          en: "I [report to] the delivery manager.",
          vi: "Tôi chịu sự quản lý trực tiếp của giám đốc delivery.",
        },
        {
          en: "In her new company, she [reports to] the CEO directly.",
          vi: "Ở công ty mới, cô ấy báo cáo trực tiếp cho CEO.",
        },
        {
          en: "Two junior BAs [report to] me.",
          vi: "Hai BA mới vào nghề do tôi quản lý trực tiếp.",
        },
      ],
      note: "'report to + người' = là cấp dưới của ai. 'report something to someone' = báo cáo việc gì cho ai. ✗ report with my manager.",
    },
    {
      kind: "vocab",
      id: "u04-stakeholder",
      term: "stakeholder",
      pos: "noun",
      ipa: "/ˈsteɪkˌhoʊldər/",
      vi: "bên liên quan",
      def: "a person or group who is affected by a project or cares about its result",
      examples: [
        {
          en: "We need to interview every key [stakeholder] before we write the requirements.",
          vi: "Chúng ta cần phỏng vấn từng bên liên quan chủ chốt trước khi viết yêu cầu.",
        },
        {
          en: "Parents are important [stakeholders] in any school decision.",
          vi: "Phụ huynh là bên liên quan quan trọng trong mọi quyết định của nhà trường.",
        },
      ],
      note: "Collocation: key stakeholders, manage stakeholders, stakeholder meeting. Đừng nhầm với 'shareholder' (cổ đông).",
    },
    {
      kind: "vocab",
      id: "u04-requirement",
      term: "requirement",
      pos: "noun",
      ipa: "/rɪˈkwaɪrmənt/",
      vi: "yêu cầu; điều kiện bắt buộc",
      def: "something that a system, a job or a person must have or do",
      examples: [
        {
          en: "The client sent us a new [requirement] for the login page.",
          vi: "Khách hàng gửi cho chúng tôi một yêu cầu mới cho trang đăng nhập.",
        },
        {
          en: "What are the [requirements] for this job?",
          vi: "Công việc này đòi hỏi những điều kiện gì?",
        },
      ],
      note: "gather/collect requirements, functional/non-functional requirements. Động từ là 'require'. ✗ a new require.",
    },
    {
      kind: "vocab",
      id: "u04-lead",
      term: "lead",
      pos: "verb",
      ipa: "/liːd/",
      vi: "dẫn dắt, lãnh đạo",
      def: "to be in charge of a group of people and guide them",
      examples: [
        {
          en: "I [lead] a team of five business analysts.",
          vi: "Tôi dẫn dắt một nhóm gồm năm chuyên viên phân tích nghiệp vụ.",
        },
        {
          en: "Who [led] the project before you joined?",
          vi: "Ai đã dẫn dắt dự án trước khi bạn tham gia?",
        },
        {
          en: "On weekends, my sister [leads] a small reading club.",
          vi: "Cuối tuần, chị tôi dẫn dắt một câu lạc bộ đọc sách nhỏ.",
        },
      ],
      note: "lead – led – led (✗ leaded). 'team lead' (danh từ) = trưởng nhóm. lead a team / a meeting / a project.",
    },
    {
      kind: "vocab",
      id: "u04-manage",
      term: "manage",
      pos: "verb",
      ipa: "/ˈmænɪdʒ/",
      vi: "quản lý",
      def: "to control and organize people, work or money",
      examples: [
        {
          en: "She [manages] the product backlog for two teams.",
          vi: "Cô ấy quản lý product backlog cho hai nhóm.",
        },
        {
          en: "How do you [manage] your time with two small kids?",
          vi: "Bạn sắp xếp thời gian thế nào khi có hai con nhỏ?",
        },
      ],
      note: "manage a team / a project / your time. 'manage to + V' = xoay xở làm được: I managed to finish it on time.",
    },
    {
      kind: "vocab",
      id: "u04-support",
      term: "support",
      pos: "verb",
      ipa: "/səˈpɔːrt/",
      vi: "hỗ trợ",
      def: "to help someone, especially when they have a problem",
      examples: [
        {
          en: "I [support] the developers when they have questions about business rules.",
          vi: "Tôi hỗ trợ các lập trình viên khi họ có câu hỏi về quy tắc nghiệp vụ.",
        },
        {
          en: "My parents [supported] me when I changed my career.",
          vi: "Bố mẹ đã ủng hộ tôi khi tôi đổi nghề.",
        },
      ],
      note: "support + người (không có 'for'): ✗ support for the team → ✓ support the team. Danh từ: give support to someone.",
    },
    {
      kind: "vocab",
      id: "u04-coordinate",
      term: "coordinate",
      pos: "verb",
      ipa: "/koʊˈɔːrdɪneɪt/",
      vi: "điều phối, phối hợp",
      def: "to organize people or activities so that they work well together",
      examples: [
        {
          en: "I [coordinate] between the client and the development team.",
          vi: "Tôi điều phối giữa khách hàng và đội phát triển.",
        },
        {
          en: "Can you [coordinate] the dinner plans for Friday?",
          vi: "Bạn lo sắp xếp kế hoạch ăn tối thứ Sáu được không?",
        },
      ],
      note: "coordinate something, coordinate with someone. Danh từ: coordination; người điều phối: coordinator.",
    },
    {
      kind: "vocab",
      id: "u04-deliver",
      term: "deliver",
      pos: "verb",
      ipa: "/dɪˈlɪvər/",
      vi: "bàn giao, hoàn thành (sản phẩm); giao (hàng)",
      def: "to finish and hand over something that you promised",
      examples: [
        {
          en: "Our team [delivers] a new release every two weeks.",
          vi: "Nhóm chúng tôi bàn giao một bản phát hành mới mỗi hai tuần.",
        },
        {
          en: "The restaurant [delivered] our food in twenty minutes.",
          vi: "Nhà hàng đã giao đồ ăn cho chúng tôi trong hai mươi phút.",
        },
      ],
      note: "deliver on time, deliver a feature, deliver value. Danh từ: delivery (delivery manager, delivery date).",
    },
    {
      kind: "vocab",
      id: "u04-domain",
      term: "domain",
      pos: "noun",
      ipa: "/doʊˈmeɪn/",
      vi: "lĩnh vực nghiệp vụ",
      def: "a particular area of business or knowledge",
      examples: [
        {
          en: "She has ten years of experience in the banking [domain].",
          vi: "Cô ấy có mười năm kinh nghiệm trong lĩnh vực ngân hàng.",
        },
        {
          en: "Healthcare is a difficult [domain] for new BAs.",
          vi: "Y tế là một lĩnh vực khó với các BA mới.",
        },
      ],
      note: "domain knowledge = kiến thức nghiệp vụ; domain expert = chuyên gia nghiệp vụ. Hay nói: the banking / insurance / e-commerce domain.",
    },
    {
      kind: "vocab",
      id: "u04-work-closely-with",
      term: "work closely with",
      pos: "phrase",
      vi: "làm việc chặt chẽ với",
      def: "to cooperate a lot with someone and share information often",
      examples: [
        {
          en: "I [work closely with] the product owner every day.",
          vi: "Ngày nào tôi cũng làm việc chặt chẽ với product owner.",
        },
        {
          en: "In a hospital, nurses [work closely with] doctors.",
          vi: "Trong bệnh viện, y tá làm việc chặt chẽ với bác sĩ.",
        },
        {
          en: "On my last project, I [worked closely with] the finance team.",
          vi: "Ở dự án trước, tôi làm việc chặt chẽ với nhóm tài chính.",
        },
      ],
      note: "Dùng trạng từ 'closely' (✗ work close with). Có thể thay: collaborate with.",
    },
    {
      kind: "pattern",
      id: "u04-simple-vs-continuous",
      title: "Hiện tại đơn vs hiện tại tiếp diễn: vai trò và dự án hiện tại",
      summary:
        "Dùng **hiện tại đơn** cho vai trò cố định, việc lặp lại thường xuyên: *I manage a team of five BAs.* Dùng **hiện tại tiếp diễn** cho việc đang diễn ra trong giai đoạn này, mang tính tạm thời (dự án hiện tại, sprint này): *We're working on a banking app.* Từ gợi ý: usually, every sprint, every day → hiện tại đơn; now, currently, this month, at the moment → hiện tại tiếp diễn. Động từ chỉ trạng thái như **know, understand, need** thường không dùng dạng -ing.",
      form: "S + V(s/es) → vai trò, thói quen | S + am/is/are + V-ing → việc đang làm, tạm thời",
      examples: [
        {
          en: "I manage a team of five business analysts.",
          vi: "Tôi quản lý một nhóm gồm năm chuyên viên phân tích nghiệp vụ.",
        },
        {
          en: "This quarter, we're working on a new payment feature.",
          vi: "Quý này, chúng tôi đang làm một tính năng thanh toán mới.",
        },
        {
          en: "I usually write user stories, but this week I'm helping with UAT.",
          vi: "Tôi thường viết user story, nhưng tuần này tôi đang hỗ trợ UAT.",
        },
      ],
      drills: [
        {
          type: "cloze",
          text: "Right now, our team [is working|'s working] on a mobile banking app.",
          vi: "Hiện giờ, nhóm chúng tôi đang làm một ứng dụng ngân hàng trên di động.",
          hint: "(work)",
          explain: "'Right now' cho biết việc đang diễn ra trong giai đoạn hiện tại → hiện tại tiếp diễn: is + V-ing.",
        },
        {
          type: "cloze",
          text: "I [report] to the delivery manager every Friday.",
          vi: "Thứ Sáu nào tôi cũng báo cáo cho giám đốc delivery.",
          hint: "(report)",
          explain: "'every Friday' là việc lặp lại đều đặn → hiện tại đơn. Chủ ngữ 'I' nên không thêm -s.",
        },
        {
          type: "fix",
          wrong: "I am knowing the business rules of this domain very well.",
          answers: ["I know the business rules of this domain very well."],
          vi: "Tôi nắm rất rõ các quy tắc nghiệp vụ của lĩnh vực này.",
          explain: "'know' là động từ chỉ trạng thái (hiểu biết), không dùng ở dạng tiếp diễn. Dùng hiện tại đơn: I know.",
        },
        {
          type: "fix",
          wrong: "We are having a stand-up meeting every morning at 9.",
          answers: [
            "We have a stand-up meeting every morning at 9.",
            "We have a stand-up meeting at 9 every morning.",
          ],
          vi: "Chúng tôi họp stand-up lúc 9 giờ mỗi sáng.",
          explain: "'every morning' là thói quen lặp lại → hiện tại đơn (We have), không dùng tiếp diễn.",
        },
        {
          type: "twoTier",
          question: "At the moment, we ___ the requirements for the HR module.",
          vi: "Hiện tại, chúng tôi đang rà soát các yêu cầu cho phân hệ nhân sự.",
          options: ["are reviewing", "review", "reviewing", "are review"],
          correct: [0],
          reasons: [
            "'At the moment' chỉ việc đang diễn ra trong giai đoạn hiện tại, nên dùng am/is/are + V-ing.",
            "Chủ ngữ 'we' là số nhiều nên luôn dùng động từ nguyên mẫu, dù có 'at the moment'.",
            "Có thể bỏ 'are' và chỉ dùng V-ing vì 'at the moment' đã cho biết thời gian.",
            "Sau 'are' dùng động từ nguyên mẫu vì 'are' cũng là động từ chia theo chủ ngữ.",
          ],
          reasonCorrect: 0,
          explain: "Hiện tại tiếp diễn cần đủ hai phần: be (are) + V-ing. 'review' sai thì, 'reviewing' thiếu 'are', 'are review' thiếu -ing.",
        },
        {
          type: "transform",
          instruction: "Rewrite the sentence to describe a temporary task this week. Add 'this week' and change the tense.",
          source: "I write user stories for the payment team.",
          answers: [
            "This week, I am writing user stories for the payment team.",
            "This week, I'm writing user stories for the payment team.",
            "This week I am writing user stories for the payment team.",
            "This week I'm writing user stories for the payment team.",
            "I am writing user stories for the payment team this week.",
            "I'm writing user stories for the payment team this week.",
          ],
          explain: "'this week' biến hành động thành việc tạm thời trong giai đoạn hiện tại → am + V-ing (I'm writing).",
        },
      ],
    },
    {
      kind: "pattern",
      id: "u04-responsible-for",
      title: "be responsible for + danh từ / V-ing",
      summary:
        "Để nói về trách nhiệm, dùng **be responsible for + danh từ / V-ing**. 'for' là giới từ, nên động từ theo sau phải thêm **-ing**. Lỗi rất phổ biến: ✗ *I am responsible to write the specs* → ✓ *I am responsible for writing the specs*. Cách nói tương tự: **be in charge of + V-ing**.",
      form: "am/is/are/was/were + responsible for + noun / V-ing",
      examples: [
        {
          en: "I am responsible for the requirement documents.",
          vi: "Tôi chịu trách nhiệm về tài liệu yêu cầu.",
        },
        {
          en: "Our BA team is responsible for writing acceptance criteria.",
          vi: "Nhóm BA của chúng tôi chịu trách nhiệm viết tiêu chí chấp nhận.",
        },
        {
          en: "Who is responsible for booking the meeting room?",
          vi: "Ai phụ trách việc đặt phòng họp?",
        },
      ],
      drills: [
        {
          type: "cloze",
          text: "Minh is responsible for [preparing] the UAT plan.",
          vi: "Minh chịu trách nhiệm chuẩn bị kế hoạch UAT.",
          hint: "(prepare)",
          explain: "Sau giới từ 'for' động từ phải ở dạng V-ing: preparing.",
        },
        {
          type: "cloze",
          text: "Who is responsible [for] the release notes this sprint?",
          vi: "Sprint này ai phụ trách release notes?",
          hint: "(preposition)",
          explain: "'responsible' luôn đi với giới từ 'for' khi nói về việc mình phụ trách.",
        },
        {
          type: "fix",
          wrong: "I am responsible to collect requirements from stakeholders.",
          answers: [
            "I am responsible for collecting requirements from stakeholders.",
            "I'm responsible for collecting requirements from stakeholders.",
          ],
          vi: "Tôi chịu trách nhiệm thu thập yêu cầu từ các bên liên quan.",
          explain: "Không dùng 'responsible to + V'. Đúng là 'responsible for + V-ing': responsible for collecting.",
        },
        {
          type: "fix",
          wrong: "She is responsible of the project budget.",
          answers: ["She is responsible for the project budget.", "She's responsible for the project budget."],
          vi: "Cô ấy chịu trách nhiệm về ngân sách dự án.",
          explain: "Giới từ đúng là 'for', không phải 'of' (dịch từ 'trách nhiệm của' dễ gây lỗi này).",
        },
        {
          type: "twoTier",
          question: "Choose ALL correct options: 'I'm ___ the sprint demo this time.'",
          vi: "Lần này tôi phụ trách điều phối buổi demo sprint.",
          options: ["responsible for running", "in charge of running", "responsible to run", "in charge to run"],
          correct: [0, 1],
          reasons: [
            "Cả 'responsible for' và 'in charge of' đều kết thúc bằng giới từ, nên động từ theo sau phải là V-ing.",
            "'responsible' đi với 'for + V-ing', còn 'in charge' đi với 'to + V'.",
            "Khi nói về việc sắp làm (this time), dùng 'to + V' sau tính từ để chỉ tương lai.",
            "Chỉ 'responsible for' đúng; 'in charge of' chỉ dùng cho người, không dùng cho công việc.",
          ],
          reasonCorrect: 0,
          explain: "'for' và 'of' đều là giới từ → theo sau là V-ing. 'responsible to run' và 'in charge to run' đều sai cấu trúc.",
        },
        {
          type: "transform",
          instruction: "Rewrite the sentence using 'be responsible for'. Start with 'I'.",
          source: "My job is to update the product backlog every week.",
          answers: [
            "I am responsible for updating the product backlog every week.",
            "I'm responsible for updating the product backlog every week.",
          ],
          explain: "'My job is to + V' → 'I am responsible for + V-ing': to update → for updating.",
        },
      ],
    },
  ],
  aiTasks: [
    {
      id: "u04-ai-1",
      kind: "writing",
      title: "Giới thiệu vai trò của bạn với nhóm mới",
      brief:
        "Bạn vừa tham gia một dự án với khách hàng nước ngoài. Product owner nhờ bạn gửi một tin nhắn giới thiệu ngắn về bản thân cho cả nhóm.",
      task:
        "Write a short self-introduction message (Slack or email) to your new project team. Include: your role, who you report to, what you are responsible for (use 'be responsible for + V-ing'), who you work closely with, and what your team is working on right now. Use the present simple for your regular job and the present continuous for your current work.",
      minWords: 80,
      criteria: [
        "Dùng đúng hiện tại đơn cho vai trò cố định và hiện tại tiếp diễn cho việc đang làm",
        "Dùng 'be responsible for + danh từ/V-ing' chính xác, không dùng 'responsible to'",
        "Có đủ ý: vai trò, báo cáo cho ai, trách nhiệm, người phối hợp, dự án hiện tại",
        "Giọng văn thân thiện, chuyên nghiệp và tự nhiên",
      ],
    },
    {
      id: "u04-ai-2",
      kind: "translation",
      title: "Dịch đoạn giới thiệu công việc",
      brief: "Bạn chuẩn bị phần giới thiệu bản thân cho buổi kick-off với khách hàng.",
      task: "Translate into natural, professional English.",
      source:
        "Tôi là trưởng nhóm BA tại một công ty phần mềm. Tôi báo cáo trực tiếp cho giám đốc dự án và quản lý một nhóm gồm bốn BA. Tôi chịu trách nhiệm thu thập yêu cầu từ các bên liên quan và hỗ trợ đội phát triển khi họ có câu hỏi về nghiệp vụ. Hiện tại, chúng tôi đang xây dựng một ứng dụng cho vay trong lĩnh vực ngân hàng.",
      criteria: [
        "Dùng đúng thì: hiện tại đơn cho vai trò, hiện tại tiếp diễn cho dự án hiện tại",
        "Dùng đúng 'report to', 'be responsible for + V-ing', 'stakeholders', 'domain'",
        "Câu văn tự nhiên, không dịch từng chữ",
        "Ngữ pháp và chính tả chính xác",
      ],
    },
  ],
}

export default unit
