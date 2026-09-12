import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import candidateService from '../../services/candidateService';
import { 
  Code, 
  Plus, 
  Trash2, 
  Edit, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Sparkles
} from 'lucide-react';

export const CandidateSkills = () => {
  const { showToast } = useAuth();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Add / Edit Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [formError, setFormError] = useState(null);

  // Delete Confirmation Modal State
  const [deletingSkill, setDeletingSkill] = useState(null);

  const fetchSkills = async () => {
    try {
      const data = await candidateService.getSkills();
      setSkills(data);
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = () => {
    setEditingSkill(null);
    setSkillName('');
    setSkillLevel('Intermediate');
    setFormError(null);
    setShowAddModal(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setSkillName(skill.skill_name);
    setSkillLevel(skill.skill_level);
    setFormError(null);
    setShowAddModal(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    setSaving(true);
    setFormError(null);

    try {
      if (editingSkill) {
        await candidateService.updateSkill(editingSkill.id, {
          skill_name: skillName.trim(),
          skill_level: skillLevel,
        });
        showToast('Skill updated successfully!', 'success');
      } else {
        await candidateService.addSkill({
          skill_name: skillName.trim(),
          skill_level: skillLevel,
        });
        showToast('Skill added successfully!', 'success');
      }
      setShowAddModal(false);
      await fetchSkills();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save skill.';
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async () => {
    if (!deletingSkill) return;

    setSaving(true);
    try {
      await candidateService.deleteSkill(deletingSkill.id);
      showToast(`Deleted skill '${deletingSkill.skill_name}'`, 'success');
      setDeletingSkill(null);
      await fetchSkills();
    } catch (err) {
      showToast('Failed to delete skill.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 'Expert':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Advanced':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Intermediate':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
        <span>Loading Technical Skill Matrix...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <Link to="/candidate/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Candidate Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Code className="w-6 h-6 text-emerald-400" /> Technical Skills Matrix
            </h1>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Technical Skill
          </button>
        </div>

        {/* Skills Cards Grid */}
        {skills.length === 0 ? (
          <div className="bg-slate-900/40 rounded-3xl p-12 text-center border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No Skills Added Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add your programming languages, frameworks, and database skills to boost your profile completion score.
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Your First Skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div 
                key={skill.id}
                className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <h3 className="text-base font-bold text-white">{skill.skill_name}</h3>
                  <span className={`inline-block mt-2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getLevelBadgeColor(skill.skill_level)}`}>
                    {skill.skill_level}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(skill)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Edit Skill"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingSkill(skill)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Delete Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add / Edit Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">
              {editingSkill ? 'Edit Skill' : 'Add Technical Skill'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">Specify technology name and proficiency level</p>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Skill / Technology Name</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. Python, React, MySQL, Docker"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Proficiency Level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none transition-all"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{editingSkill ? 'Save Changes' : 'Add Skill'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Skill Confirmation Dialog Modal */}
      {deletingSkill && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-center">
            
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Delete Skill?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to remove <strong className="text-white">{deletingSkill.skill_name}</strong> from your profile skills matrix?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingSkill(null)}
                className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSkill}
                disabled={saving}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Delete</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CandidateSkills;
