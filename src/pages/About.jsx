import { Target, BarChart3, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md p-6 md:p-10 max-w-4xl mx-auto animate-fade-in border dark:border-super-dark-border">
      <div className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white rounded-lg shadow-lg p-8 mb-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
            Sobre o <span className="text-yellow-300">prospect</span>&nbsp;Radar
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Analisando o futuro do basquete, um prospect de cada vez.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Nossa Missão */}
        <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md p-6 border dark:border-super-dark-border">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 dark:bg-black/50 text-blue-600 dark:text-blue-300 rounded-full p-4">
                <Target size={40} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-super-dark-text-primary mb-3">Nossa Missão</h2>
              <p className="text-slate-700 dark:text-super-dark-text-secondary leading-relaxed">
                Nossa missão no prospectRadar é centralizar e democratizar o acesso a dados de scouting de jovens talentos do basquete. Acreditamos que, com as ferramentas certas, fãs, analistas e até mesmo os próprios jogadores podem ter uma compreensão mais profunda sobre as futuras estrelas do esporte.
              </p>
            </div>
          </div>
        </div>

        {/* O que fazemos */}
        <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md p-6 border dark:border-super-dark-border">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-shrink-0">
              <div className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 rounded-full p-4">
                <BarChart3 size={40} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-super-dark-text-primary mb-3">Nossos Dados</h2>
              <p className="text-slate-700 dark:text-super-dark-text-secondary leading-relaxed">
                Agregamos dados de fontes confiáveis, como rankings da ESPN, 247Sports e estatísticas de ligas de desenvolvimento regionais. Oferecemos uma plataforma intuitiva para você explorar perfis de jogadores, comparar atributos e até simular seus próprios Mock Drafts.
              </p>
            </div>
          </div>
        </div>

        {/* Para Quem */}
        <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md p-6 border dark:border-super-dark-border">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 rounded-full p-4">
                <Users size={40} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-super-dark-text-primary mb-3">Para Quem é o prospectRadar?</h2>
              <ul className="list-disc list-inside text-slate-700 dark:text-super-dark-text-secondary space-y-2">
                <li><strong>Fãs de Basquete:</strong> Para quem ama acompanhar o surgimento de novos talentos.</li>
                <li><strong>Scouts e Analistas:</strong> Uma ferramenta poderosa para otimizar o processo de scouting.</li>
                <li><strong>Jogadores e Treinadores:</strong> Para entender o cenário competitivo e identificar pontos de melhoria.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-12 pt-8 border-t dark:border-super-dark-border">
        <p className="text-slate-600 dark:text-super-dark-text-secondary">
          Feito com paixão por basquete, por brasileiros para a comunidade global.
        </p>
      </div>
    </div>
  );
};

export default About;
