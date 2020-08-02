interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'gustavo@gobarber.digital',
      name: 'Gustavo da Equipe GoBarber',
    },
  },
} as IMailConfig;
