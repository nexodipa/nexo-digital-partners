// Keep the audit corrections in the same source-key catalogue as the existing site.
(() => {
  const languages = ['es', 'en', 'de', 'fr', 'pt', 'it', 'ru', 'cs', 'zh', 'ja', 'he', 'ar'];
  const rows = [
    ['Webs para salud y educación. Herramientas para ordenar el trabajo de tu negocio.', 'Websites for health and education. Tools to organise your business workflows.', 'Websites für Gesundheit und Bildung. Werkzeuge für geordnete Geschäftsabläufe.', 'Sites pour la santé et l’éducation. Des outils pour organiser le travail de votre entreprise.', 'Sites para saúde e educação. Ferramentas para organizar o trabalho do seu negócio.', 'Siti per salute e istruzione. Strumenti per organizzare il lavoro della tua attività.', 'Сайты для здравоохранения и образования. Инструменты для организации работы бизнеса.', 'Weby pro zdravotnictví a vzdělávání. Nástroje pro organizaci práce ve firmě.', '面向健康与教育的网站，以及帮助企业组织工作的工具。', '健康・教育分野のウェブサイトと、業務を整理するツール。', 'אתרים לבריאות ולחינוך. כלים לארגון העבודה בעסק.', 'مواقع للصحة والتعليم. أدوات لتنظيم العمل في نشاطك التجاري.'],
    ['Ver demo reducida', 'View limited demo', 'Begrenzte Demo ansehen', 'Voir la démo limitée', 'Ver demonstração reduzida', 'Vedi demo limitata', 'Открыть ограниченную демоверсию', 'Zobrazit omezenou ukázku', '查看精简演示', '限定デモを見る', 'צפייה בהדגמה מצומצמת', 'عرض النسخة التوضيحية المحدودة'],
    ['Ver alcance', 'View scope', 'Umfang ansehen', 'Voir le périmètre', 'Ver escopo', 'Vedi ambito', 'Посмотреть границы проекта', 'Zobrazit rozsah', '查看范围', '範囲を確認', 'צפייה בהיקף', 'عرض النطاق'],
    ['Sitio propio de psicoeducación: organización de servicios, recursos y contacto. No es una clínica online.', 'Our own psychoeducation website: service structure, resources and contact. Not an online clinic.', 'Eigene Website für Psychoedukation: Dienstleistungen, Ressourcen und Kontakt. Keine Online-Klinik.', 'Notre site de psychoéducation : services, ressources et contact. Ce n’est pas une clinique en ligne.', 'Site próprio de psicoeducação: serviços, recursos e contato. Não é uma clínica online.', 'Sito proprio di psicoeducazione: servizi, risorse e contatti. Non è una clinica online.', 'Собственный сайт психообразования: услуги, материалы и контакты. Не онлайн-клиника.', 'Vlastní psychoedukační web: služby, zdroje a kontakt. Nejde o online kliniku.', '自有心理教育网站：服务结构、资源与联系渠道。并非在线诊所。', '自社の心理教育サイト。サービス、資料、連絡先を整理しています。オンライン診療所ではありません。', 'אתר פסיכו־חינוכי עצמאי: שירותים, משאבים ויצירת קשר. אינו מרפאה מקוונת.', 'موقعنا للتثقيف النفسي: تنظيم الخدمات والموارد والتواصل. ليس عيادة إلكترونية.'],
    ['Entrega y contacto · ES / EN', 'Delivery and contact · ES / EN', 'Übergabe und Kontakt · ES / EN', 'Livraison et contact · ES / EN', 'Entrega e contato · ES / EN', 'Consegna e contatti · ES / EN', 'Передача и контакты · ES / EN', 'Předání a kontakt · ES / EN', '交付与联系 · ES / EN', '納品とお問い合わせ · ES / EN', 'מסירה ויצירת קשר · ES / EN', 'التسليم والتواصل · ES / EN'],
    ['Página de servicio', 'Service page', 'Dienstleistungsseite', 'Page de service', 'Página de serviço', 'Pagina di servizio', 'Страница услуги', 'Stránka služby', '服务页面', 'サービスページ', 'עמוד שירות', 'صفحة خدمة']
  ];
  rows.forEach(row => languages.forEach((lang, i) => {
    window.NEXO_TRANSLATIONS[lang][row[0]] = row[i];
  }));
  languages.forEach(lang => {
    window.NEXO_TRANSLATIONS[lang]['Landing Express'] = window.NEXO_TRANSLATIONS[lang]['Página de servicio'];
  });
})();
