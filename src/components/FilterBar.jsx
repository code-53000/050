import { useFilterStore } from '../store/useFilterStore'
import { PLATFORMS, CONDITIONS, STATUS_LABELS } from '../constants'

export default function FilterBar() {
  const {
    platform,
    condition,
    status,
    searchText,
    setPlatform,
    setCondition,
    setStatus,
    setSearchText,
    resetFilters,
  } = useFilterStore()

  return (
    <div className="panel">
      <h3>筛选条件</h3>

      <div className="filter-group">
        <label>搜索游戏名</label>
        <input
          type="text"
          placeholder="输入关键词..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>平台</label>
        <select value={platform} onChange={e => setPlatform(e.target.value)}>
          <option value="all">全部平台</option>
          {PLATFORMS.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>成色</label>
        <select value={condition} onChange={e => setCondition(e.target.value)}>
          <option value="all">全部成色</option>
          {CONDITIONS.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>状态</label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="all">全部状态</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <button
        className="btn btn-secondary btn-small"
        onClick={resetFilters}
        style={{ width: '100%', marginTop: '8px' }}
      >
        重置筛选
      </button>
    </div>
  )
}
