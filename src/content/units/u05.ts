import type { Unit } from '../types.ts'

const unit: Unit = {
  id: "u05",
  order: 5,
  level: "B1",
  topic: "work",
  title: "Requirements and user stories",
  titleVi: "Yêu cầu và user story",
  goal: "Viết và trao đổi về user story, tiêu chí chấp nhận, phạm vi; xếp ưu tiên bằng must/should/could/won't và viết yêu cầu ở dạng bị động với modal.",
  items: [
    {
      kind: "vocab",
      id: "u05-user-story",
      term: "user story",
      pos: "noun",
      vi: "user story (mô tả tính năng từ góc nhìn người dùng)",
      def: "a short description of a feature, written from the point of view of the person who will need it",
      examples: [
        {
          en: "Can you write a [user story] for the password reset feature?",
          vi: "Bạn viết giúp một user story cho tính năng đặt lại mật khẩu được không?",
        },
        {
          en: "The team estimated each [user story] in the planning meeting.",
          vi: "Nhóm đã ước lượng từng user story trong buổi họp lập kế hoạch.",
        },
        {
          en: "This [user story] is too big, so let's split it into three.",
          vi: "User story này quá lớn, nên hãy tách nó thành ba cái.",
        },
      ],
      note: "Mẫu chuẩn: 'As a <role>, I want <goal> so that <benefit>.' Collocation: write / split / estimate a user story.",
    },
    {
      kind: "vocab",
      id: "u05-acceptance-criteria",
      term: "acceptance criteria",
      pos: "noun",
      vi: "tiêu chí chấp nhận",
      def: "the conditions a feature must meet before the client agrees that it is done",
      examples: [
        {
          en: "Every story needs clear [acceptance criteria] before the sprint starts.",
          vi: "Mỗi story cần có tiêu chí chấp nhận rõ ràng trước khi sprint bắt đầu.",
        },
        {
          en: "The tester checked the new feature against the [acceptance criteria].",
          vi: "Tester đã kiểm tra tính năng mới dựa trên tiêu chí chấp nhận.",
        },
      ],
      note: "'criteria' là số nhiều, số ít là 'criterion'. Văn viết chuẩn: The acceptance criteria are clear. Viết tắt thường gặp: AC.",
    },
    {
      kind: "vocab",
      id: "u05-scope",
      term: "scope",
      pos: "noun",
      ipa: "/skoʊp/",
      vi: "phạm vi",
      def: "the limits of what a project or activity includes",
      examples: [
        {
          en: "The client wants two more reports, but that will change the [scope] of the project.",
          vi: "Khách hàng muốn thêm hai báo cáo nữa, nhưng điều đó sẽ thay đổi phạm vi dự án.",
        },
        {
          en: "That question is outside the [scope] of today's class.",
          vi: "Câu hỏi đó nằm ngoài phạm vi của buổi học hôm nay.",
        },
      ],
      note: "project scope, expand / reduce the scope, scope creep (phạm vi phình to dần do thêm yêu cầu).",
    },
    {
      kind: "vocab",
      id: "u05-out-of-scope",
      term: "out of scope",
      pos: "phrase",
      vi: "nằm ngoài phạm vi",
      def: "not included in the work that was agreed",
      examples: [
        {
          en: "Mobile support is [out of scope] for phase one.",
          vi: "Hỗ trợ trên di động nằm ngoài phạm vi của giai đoạn một.",
        },
        {
          en: "Salary questions are [out of scope] for this team meeting.",
          vi: "Các câu hỏi về lương nằm ngoài phạm vi của buổi họp nhóm này.",
        },
      ],
      note: "Ngược nghĩa: in scope. Có thể nói 'outside the scope of + noun'. ✗ outside of scope.",
    },
    {
      kind: "vocab",
      id: "u05-edge-case",
      term: "edge case",
      pos: "noun",
      vi: "trường hợp biên, tình huống hiếm",
      def: "an unusual situation that only happens at the limits of normal use",
      examples: [
        {
          en: "What if the user enters a negative amount? That's an [edge case] we need to handle.",
          vi: "Nếu người dùng nhập số tiền âm thì sao? Đó là trường hợp biên chúng ta cần xử lý.",
        },
        {
          en: "My mom plans for every [edge case], like rain or a power cut on the wedding day.",
          vi: "Mẹ tôi tính trước mọi tình huống hiếm, như trời mưa hay mất điện vào ngày cưới.",
        },
      ],
      note: "handle / cover an edge case. Gần nghĩa: corner case. Tester hay hỏi: 'Did you cover the edge cases?'",
    },
    {
      kind: "vocab",
      id: "u05-assumption",
      term: "assumption",
      pos: "noun",
      ipa: "/əˈsʌmpʃən/",
      vi: "giả định",
      def: "something you believe is true although you have no proof",
      examples: [
        {
          en: "Our [assumption] is that all users have a company email account.",
          vi: "Giả định của chúng tôi là mọi người dùng đều có tài khoản email công ty.",
        },
        {
          en: "Don't make [assumptions] about people because of their accent.",
          vi: "Đừng vội đánh giá người khác chỉ vì giọng nói của họ.",
        },
      ],
      note: "make an assumption (✗ do an assumption); based on the assumption that... Động từ: assume.",
    },
    {
      kind: "vocab",
      id: "u05-constraint",
      term: "constraint",
      pos: "noun",
      ipa: "/kənˈstreɪnt/",
      vi: "ràng buộc, giới hạn",
      def: "a limit that controls what you can do",
      examples: [
        {
          en: "Budget is our biggest [constraint] this year.",
          vi: "Ngân sách là ràng buộc lớn nhất của chúng tôi năm nay.",
        },
        {
          en: "Because of time [constraints], we can only visit two museums today.",
          vi: "Vì giới hạn thời gian, hôm nay chúng ta chỉ tham quan được hai bảo tàng.",
        },
      ],
      note: "time / budget / technical constraints. Khác 'assumption': assumption là điều ta tin là đúng, constraint là giới hạn bắt buộc phải tuân theo.",
    },
    {
      kind: "vocab",
      id: "u05-priority",
      term: "priority",
      pos: "noun",
      ipa: "/praɪˈɔːrəti/",
      vi: "sự ưu tiên, việc ưu tiên",
      def: "something that is more important than other things and needs attention first",
      examples: [
        {
          en: "Security is our top [priority] for this release.",
          vi: "Bảo mật là ưu tiên hàng đầu của chúng tôi trong bản phát hành này.",
        },
        {
          en: "Right now, my health is my first [priority].",
          vi: "Lúc này, sức khỏe là ưu tiên số một của tôi.",
        },
      ],
      note: "top / high / low priority. ✗ the most priority. Động từ: prioritize. Tiếng Việt hay nói 'ưu tiên cái này' → prioritize this (không dùng 'priority this').",
    },
    {
      kind: "vocab",
      id: "u05-sign-off",
      term: "sign off",
      pos: "phrasal verb",
      vi: "phê duyệt, ký xác nhận",
      def: "to give official approval to a document, plan or piece of work",
      examples: [
        {
          en: "The client [signed off on|signed off] the requirements yesterday.",
          vi: "Hôm qua khách hàng đã ký duyệt tài liệu yêu cầu.",
        },
        {
          en: "My manager has to [sign off on] my vacation request.",
          vi: "Quản lý của tôi phải phê duyệt đơn xin nghỉ phép của tôi.",
        },
      ],
      note: "Tiếng Anh Mỹ: sign off on + something. Danh từ: sign-off (get sign-off from the client).",
    },
    {
      kind: "vocab",
      id: "u05-backlog",
      term: "backlog",
      pos: "noun",
      vi: "danh sách công việc chờ làm; việc tồn đọng",
      def: "a list of work that is waiting to be done",
      examples: [
        {
          en: "Please add this request to the product [backlog].",
          vi: "Vui lòng thêm yêu cầu này vào product backlog.",
        },
        {
          en: "After my vacation, I had a huge [backlog] of emails.",
          vi: "Sau kỳ nghỉ, tôi có cả đống email tồn đọng.",
        },
      ],
      note: "product backlog, sprint backlog; add to / refine the backlog. Buổi 'backlog refinement' = buổi làm rõ và sắp xếp backlog.",
    },
    {
      kind: "vocab",
      id: "u05-mandatory",
      term: "mandatory",
      pos: "adjective",
      ipa: "/ˈmændətɔːri/",
      vi: "bắt buộc",
      def: "required by a rule; you cannot choose not to do it",
      examples: [
        {
          en: "The phone number field is [mandatory] on this form.",
          vi: "Trường số điện thoại là bắt buộc trên biểu mẫu này.",
        },
        {
          en: "Wearing a helmet is [mandatory] on a motorbike in Vietnam.",
          vi: "Ở Việt Nam, đi xe máy bắt buộc phải đội mũ bảo hiểm.",
        },
      ],
      note: "mandatory field = trường bắt buộc. Trái nghĩa: optional (không bắt buộc).",
    },
    {
      kind: "vocab",
      id: "u05-nice-to-have",
      term: "nice-to-have",
      pos: "noun",
      vi: "tính năng có thì tốt (không bắt buộc)",
      def: "something that would be good to include but is not necessary",
      examples: [
        {
          en: "Dark mode is a [nice-to-have], not a must-have.",
          vi: "Chế độ tối là tính năng có thì tốt, không phải bắt buộc phải có.",
        },
        {
          en: "A pool at the hotel is a [nice-to-have] for our family trip.",
          vi: "Hồ bơi ở khách sạn là điều có thì tốt cho chuyến đi gia đình chúng tôi.",
        },
      ],
      note: "Đối lập với 'must-have'. Hay dùng khi xếp ưu tiên theo MoSCoW (thường ứng với 'Could have').",
    },
    {
      kind: "pattern",
      id: "u05-modals-moscow",
      title: "must / should / could / won't + V nguyên mẫu (MoSCoW)",
      summary:
        "MoSCoW là cách xếp ưu tiên yêu cầu: **Must** (bắt buộc), **Should** (nên có), **Could** (có thì tốt), **Won't** (lần này không làm). Sau must/should/could/won't luôn là **động từ nguyên mẫu không 'to'**, và động từ không thêm -s. Lỗi hay gặp: ✗ *must to support*, ✗ *should supports* → ✓ *must support*, *should support*.",
      form: "must / should / could / won't + V (base form)",
      examples: [
        {
          en: "The system must support login with a company email.",
          vi: "Hệ thống phải hỗ trợ đăng nhập bằng email công ty.",
        },
        {
          en: "The report should show data for the last 12 months.",
          vi: "Báo cáo nên hiển thị dữ liệu của 12 tháng gần nhất.",
        },
        {
          en: "We won't build the mobile version in this release.",
          vi: "Chúng tôi sẽ không làm phiên bản di động trong bản phát hành này.",
        },
      ],
      drills: [
        {
          type: "cloze",
          text: "The app must [send] a confirmation email after each payment.",
          vi: "Ứng dụng phải gửi email xác nhận sau mỗi lần thanh toán.",
          hint: "(send)",
          explain: "Sau 'must' dùng động từ nguyên mẫu không 'to' và không thêm -s: must send.",
        },
        {
          type: "cloze",
          text: "Export to Excel is a nice-to-have, so we [could] add it if we have time.",
          vi: "Xuất ra Excel là tính năng có thì tốt, nên chúng ta có thể thêm nếu còn thời gian.",
          hint: "(MoSCoW modal)",
          explain: "Nice-to-have ứng với 'Could have' trong MoSCoW → dùng 'could' (có thể làm nếu còn thời gian).",
        },
        {
          type: "fix",
          wrong: "The user must to enter a valid email address.",
          answers: ["The user must enter a valid email address."],
          vi: "Người dùng phải nhập địa chỉ email hợp lệ.",
          explain: "'must' là động từ khuyết thiếu, không đi với 'to'. Bỏ 'to': must enter.",
        },
        {
          type: "fix",
          wrong: "The dashboard should displays the total sales for each region.",
          answers: ["The dashboard should display the total sales for each region."],
          vi: "Dashboard nên hiển thị tổng doanh số của từng khu vực.",
          explain: "Sau modal, động từ luôn ở dạng nguyên mẫu, không thêm -s dù chủ ngữ số ít: should display.",
        },
        {
          type: "twoTier",
          question: "The business cannot go live without this rule. Choose ALL correct sentences.",
          vi: "Doanh nghiệp không thể vận hành nếu thiếu quy tắc này. Chọn TẤT CẢ câu đúng.",
          options: [
            "The system must lock the account after five failed attempts.",
            "The system must locks the account after five failed attempts.",
            "The system must to lock the account after five failed attempts.",
            "The system has to lock the account after five failed attempts.",
          ],
          correct: [0, 3],
          reasons: [
            "Sau modal 'must' dùng V nguyên mẫu không 'to'; 'has to + V' cũng diễn tả nghĩa bắt buộc.",
            "Chủ ngữ 'The system' số ít nên động từ sau 'must' phải thêm -s.",
            "'must' giống 'have', nên luôn cần 'to' trước động từ.",
            "Chỉ 'must' diễn tả bắt buộc; 'has to' chỉ dùng trong văn nói, sai trong tài liệu yêu cầu.",
          ],
          reasonCorrect: 0,
          explain: "'must lock' và 'has to lock' đều đúng. 'must locks' sai vì thêm -s sau modal; 'must to lock' sai vì modal không đi với 'to'.",
        },
        {
          type: "transform",
          instruction: "Rewrite this as a 'Won't have' item for this release. Use won't + base verb and add 'in this release'.",
          source: "The system supports payment by credit card.",
          answers: [
            "The system won't support payment by credit card in this release.",
            "The system will not support payment by credit card in this release.",
            "In this release, the system won't support payment by credit card.",
            "In this release, the system will not support payment by credit card.",
          ],
          explain: "won't = will not, theo sau là V nguyên mẫu: supports → won't support.",
        },
      ],
    },
    {
      kind: "pattern",
      id: "u05-modal-passive",
      title: "Bị động với modal: must be + V3",
      summary:
        "Trong tài liệu yêu cầu, ta thường nhấn mạnh **dữ liệu hoặc chức năng cần được xử lý**, không phải ai làm. Khi đó dùng **modal + be + V3**: *The report must be exported as PDF.* Lỗi hay gặp: thiếu 'be' (✗ *must exported*) hoặc dùng V nguyên mẫu thay vì V3 (✗ *must be export*).",
      form: "must / should / could / can + be + V3 (past participle)",
      examples: [
        {
          en: "The report must be exported as PDF.",
          vi: "Báo cáo phải được xuất ra dạng PDF.",
        },
        {
          en: "Passwords should be stored in encrypted form.",
          vi: "Mật khẩu nên được lưu ở dạng mã hóa.",
        },
        {
          en: "This field can be left empty.",
          vi: "Trường này có thể để trống.",
        },
      ],
      drills: [
        {
          type: "cloze",
          text: "All refunds must [be approved] by a manager.",
          vi: "Mọi khoản hoàn tiền phải được quản lý phê duyệt.",
          hint: "(approve)",
          explain: "Khoản hoàn tiền không tự phê duyệt mà được phê duyệt → bị động: must + be + V3 (approved).",
        },
        {
          type: "cloze",
          text: "The invoice should be [sent] to the customer within 24 hours.",
          vi: "Hóa đơn nên được gửi cho khách hàng trong vòng 24 giờ.",
          hint: "(send)",
          explain: "Sau 'should be' cần V3: send – sent – sent.",
        },
        {
          type: "fix",
          wrong: "The data must exported to the warehouse every night.",
          answers: ["The data must be exported to the warehouse every night."],
          vi: "Dữ liệu phải được xuất sang kho dữ liệu mỗi đêm.",
          explain: "Bị động với modal cần đủ 'be': must be exported.",
        },
        {
          type: "fix",
          wrong: "Attachments can be upload by any team member.",
          answers: ["Attachments can be uploaded by any team member."],
          vi: "Thành viên nào trong nhóm cũng có thể tải tệp đính kèm lên.",
          explain: "Sau 'be' trong câu bị động phải dùng V3: uploaded, không dùng V nguyên mẫu 'upload'.",
        },
        {
          type: "twoTier",
          question: "Complete the requirement: 'Inactive accounts ___ after two years.' Choose ALL correct options.",
          vi: "Tài khoản không hoạt động ... sau hai năm.",
          options: ["should be deleted", "must be deleted", "should be delete", "must deleted"],
          correct: [0, 1],
          reasons: [
            "Tài khoản không tự xóa mà bị xóa, nên dùng bị động đủ ba phần: modal + be + V3.",
            "Sau modal dùng V nguyên mẫu, nên 'be' + 'delete' là đủ cho câu bị động.",
            "Khi đã có modal thì có thể bỏ 'be' trong câu bị động.",
            "Chỉ 'should' dùng được trong câu bị động; 'must' không đi với 'be'.",
          ],
          reasonCorrect: 0,
          explain: "'should be deleted' và 'must be deleted' đều đúng (khác mức độ bắt buộc). 'should be delete' thiếu V3; 'must deleted' thiếu 'be'.",
        },
        {
          type: "transform",
          instruction: "Rewrite in the passive. Start with 'The report'.",
          source: "The system must generate the report every Monday.",
          answers: [
            "The report must be generated every Monday.",
            "The report must be generated by the system every Monday.",
            "The report must be generated every Monday by the system.",
          ],
          explain: "Tân ngữ 'the report' lên làm chủ ngữ; must generate → must be generated. 'by the system' có thể bỏ vì không quan trọng.",
        },
      ],
    },
  ],
  aiTasks: [
    {
      id: "u05-ai-1",
      kind: "writing",
      title: "Viết user story kèm tiêu chí chấp nhận",
      brief:
        "Khách hàng muốn có chức năng xem và xuất báo cáo doanh thu hằng tháng. Bạn cần viết user story để đưa vào backlog trước buổi refinement.",
      task:
        "Write one user story for a 'monthly sales report' feature in the format 'As a ..., I want ..., so that ...'. Then write at least four acceptance criteria using must / should / could / won't. At least two criteria must be passive sentences with modals (e.g. 'The report must be exported as PDF'). Finally, add one assumption, one constraint, and one item that is out of scope.",
      minWords: 100,
      criteria: [
        "User story đúng định dạng 'As a ..., I want ..., so that ...'",
        "Dùng modal + V nguyên mẫu đúng (không 'must to', không thêm -s)",
        "Có ít nhất hai câu bị động với modal đúng cấu trúc (modal + be + V3)",
        "Có assumption, constraint và mục out of scope rõ ràng, hợp lý",
      ],
    },
    {
      id: "u05-ai-2",
      kind: "translation",
      title: "Dịch email cập nhật phạm vi",
      brief: "Bạn gửi email cho khách hàng sau khi chốt lại phạm vi giai đoạn 1.",
      task: "Translate into natural, professional English.",
      source:
        "Chúng tôi đã cập nhật phạm vi của giai đoạn 1. Chức năng thanh toán bằng thẻ tín dụng nằm ngoài phạm vi và sẽ được chuyển vào backlog. Mỗi user story phải có tiêu chí chấp nhận rõ ràng trước khi đội phát triển ước lượng. Chúng tôi giả định rằng tất cả người dùng đều có tài khoản email công ty. Anh/chị vui lòng xem lại và ký duyệt tài liệu yêu cầu trước thứ Sáu.",
      criteria: [
        "Dùng đúng thuật ngữ: scope, out of scope, backlog, acceptance criteria, sign off",
        "Dùng đúng modal và bị động với modal (must have, will be moved...)",
        "Giọng văn lịch sự, chuyên nghiệp, phù hợp email gửi khách hàng",
        "Ngữ pháp và chính tả chính xác",
      ],
    },
  ],
}

export default unit
