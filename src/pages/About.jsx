import { Target, BarChart3, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-10 max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Sobre o <span className="text-brand-orange">Prospect</span>Radar
        </h1>
        <p className="text-lg text-gray-600">
          Analisando o futuro do basquete, um prospect de cada vez.
        </p>
      </div>

      <div className="space-y-12">
        {/* Nossa Missão */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="bg-blue-100 text-blue-600 rounded-full p-4">
              <Target size={40} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Nossa Missão</h2>
            <p className="text-gray-700 leading-relaxed">
              Nossa missão no ProspectRadar é centralizar e democratizar o acesso a dados de scouting de jovens talentos do basquete. Acreditamos que, com as ferramentas certas, fãs, analistas e até mesmo os próprios jogadores podem ter uma compreensão mais profunda sobre as futuras estrelas do esporte.
            </p>
          </div>
        </div>

        {/* O que fazemos */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="flex-shrink-0">
            <div className="bg-green-100 text-green-600 rounded-full p-4">
              <BarChart3 size={40} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Nossos Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Agregamos dados de fontes confiáveis, como rankings da ESPN, 247Sports e estatísticas de ligas de desenvolvimento regionais. Oferecemos uma plataforma intuitiva para você explorar perfis de jogadores, comparar atributos e até simular seus próprios Mock Drafts.
            </p>
          </div>
        </div>

        {/* Para Quem */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="bg-purple-100 text-purple-600 rounded-full p-4">
              <Users size={40} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Para Quem é o ProspectRadar?</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Fãs de Basquete:</strong> Para quem ama acompanhar o surgimento de novos talentos.</li>
              <li><strong>Scouts e Analistas:</strong> Uma ferramenta poderosa para otimizar o processo de scouting.</li>
              <li><strong>Jogadores e Treinadores:</strong> Para entender o cenário competitivo e identificar pontos de melhoria.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center mt-12 pt-8 border-t">
        <p className="text-gray-600">
          Feito com paixão por basquete, por brasileiros para a comunidade global.
        </p>
      </div>
    </div>
  );
};

export default About;
