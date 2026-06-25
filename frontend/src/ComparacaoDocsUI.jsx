import React, { useState } from 'react';

export default function ComparacaoDocsUI() {
  const [minuta, setMinuta] = useState(null);
  const [contrato, setContrato] = useState(null);
  const [divergencias, setDivergencias] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleComparar = async () => {
    setLoading(true);
    // Simula a chamada para a API REST no backend Node.js
    try {
      const response = await fetch('/api/processor/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contratoId: contrato.name, minutaId: minuta.name })
      });
      const data = await response.json();
      setDivergencias(data.divergencias); // Retorna os dados para a View
    } catch (error) {
      console.error("Erro ao comparar:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Comparação de Documentos</h2>
      
      <div className="flex gap-4 mb-6">
        <div className="border p-4 rounded-lg w-1/2 bg-gray-50">
          <label className="block mb-2 font-semibold">Minuta do Edital (PDF)</label>
          <input type="file" accept=".pdf" onChange={(e) => setMinuta(e.target.files[0])} />
        </div>
        <div className="border p-4 rounded-lg w-1/2 bg-gray-50">
          <label className="block mb-2 font-semibold">Contrato Assinado (PDF)</label>
          <input type="file" accept=".pdf" onChange={(e) => setContrato(e.target.files[0])} />
        </div>
      </div>

      <button 
        onClick={handleComparar} 
        disabled={!minuta || !contrato || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-400 hover:bg-blue-700 transition"
      >
        {loading ? 'Processando Documentos...' : 'Comparar Documentos'}
      </button>

      {/* Relatório de Divergências (RF-2) */}
      {divergencias && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Relatório de Divergências</h3>
          <table className="w-full text-left border-collapse shadow-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-3">Cláusula/Campo</th>
                <th className="border p-3">Dado na Minuta</th>
                <th className="border p-3">Dado no Contrato</th>
                <th className="border p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {divergencias.map((div, idx) => (
                <tr key={idx} className={div.critico ? "bg-red-50" : "bg-white"}>
                  <td className="border p-3 font-semibold">{div.campo}</td>
                  <td className="border p-3">{div.minuta}</td>
                  <td className="border p-3 font-bold text-red-600">{div.contrato}</td>
                  <td className="border p-3">
                    {div.critico ? "⚠️ Divergência Crítica" : "Aviso"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">
            Exportar Relatório (PDF)
          </button>
        </div>
      )}
    </div>
  );
}