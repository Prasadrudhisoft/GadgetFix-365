// src/Components/admin/CategoriesGrid.jsx
import { useData } from '../../hooks/useData';
import Spinner from '../shared/Spinner';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const CategoriesGrid = ({ onAddCategory }) => {
  const { categories, isLoadingCategories } = useData();

  if (isLoadingCategories && categories.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '22px',
            fontWeight: 800,
            color: '#0a1628',
            letterSpacing: '-0.5px',
            margin: 0
          }}>
            Categories
          </h2>
          <p style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '13px',
            color: '#7a9cc4',
            marginTop: '3px',
            fontWeight: 500
          }}>
            Manage device repair categories
          </p>
        </div>

        <button
          onClick={onAddCategory}
          style={{
            padding: '10px 20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)',
            color: '#fff',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '13px',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 32px rgba(29, 78, 216, 0.38)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 28px rgba(29, 78, 216, 0.48)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(29, 78, 216, 0.38)';
          }}
        >
          <i className="fas fa-plus"></i> Add Category
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
        gap: '18px',
        marginTop: '6px'
      }}>
        {categories.length === 0 ? (
          <p style={{
            gridColumn: '1/-1',
            textAlign: 'center',
            color: '#7a9cc4',
            padding: '40px'
          }}>
            No categories yet. Add one!
          </p>
        ) : (
          categories.map(category => (
            <div
              key={category.id}
              style={{
                background: '#ffffff',
                border: '1.5px solid rgba(37, 99, 235, 0.09)',
                borderRadius: '22px',
                padding: '22px',
                textAlign: 'center',
                transition: 'all 0.36s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#bfdbfe';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(29, 78, 216, 0.13), 0 8px 18px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(-6px)';
                const bar = e.currentTarget.querySelector('.category-bar');
                if (bar) bar.style.transform = 'scaleX(1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.09)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
                const bar = e.currentTarget.querySelector('.category-bar');
                if (bar) bar.style.transform = 'scaleX(0)';
              }}
            >
              <span
                className="category-bar"
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '3px',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)',
                  transform: 'scaleX(0)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />

              {category.photo_path ? (
                <img
                  src={`${API_BASE}${category.photo_path}?_=${Date.now()}`}
                  alt={category.category_name}
                  style={{
                    width: '62px', height: '62px',
                    borderRadius: '16px', objectFit: 'cover',
                    margin: '0 auto 13px', display: 'block',
                    boxShadow: '0 2px 8px rgba(29, 78, 216, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}

              <div style={{
                fontSize: '42px', marginBottom: '13px',
                display: category.photo_path ? 'none' : 'flex',
                justifyContent: 'center'
              }}>
                🗂️
              </div>

              <h4 style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: '14px', fontWeight: 700,
                color: '#0a1628', marginBottom: '3px'
              }}>
                {category.category_name}
              </h4>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default CategoriesGrid;