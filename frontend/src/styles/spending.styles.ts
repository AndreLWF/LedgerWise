import { Platform, StyleSheet } from 'react-native';

export const spendingStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spinner: {
    marginTop: 40,
  },
  emptyText: {
    color: '#64748b',
    marginTop: 40,
    textAlign: 'center',
    fontSize: 14,
  },

  // --- Summary Strip ---
  summaryStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
  },
  uncategorizedCard: {
    borderWidth: 1.5,
    borderColor: '#f87171',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
  },
  uncategorizedValue: {
    color: '#f87171',
  },
  cardSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  // --- Proportion Bar ---
  proportionBarContainer: {
    marginBottom: 24,
  },
  proportionBar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
  },
  proportionSegment: {
    height: '100%' as unknown as number,
  },
  proportionSegmentFirst: {
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  proportionSegmentLast: {
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
  },

  // --- Accordion Categories ---
  categoriesContainer: {
    paddingBottom: 0,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    ...Platform.select({
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.08)' },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      },
    }),
  },
  uncategorizedRow: {
    borderWidth: 1.5,
    borderColor: '#f87171',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  countBadge: {
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTotal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f1f5f9',
    marginRight: 8,
  },
  expandArrow: {
    fontSize: 10,
    color: '#64748b',
  },

  // --- Expanded Transactions ---
  expandedTxn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 20,
    marginBottom: 2,
    borderLeftWidth: 2,
    borderLeftColor: '#334155',
  },
  expandedTxnLeft: {
    flex: 1,
    marginRight: 12,
  },
  expandedTxnDesc: {
    fontSize: 13,
    color: '#94a3b8',
  },
  expandedTxnMeta: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  expandedTxnAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f87171',
  },
  expandedTxnRefund: {
    color: '#22c55e',
  },

  // --- Refund Section ---
  refundSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingBottom: 40,
  },
  refundSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22c55e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  refundRow: {
    borderWidth: 1.5,
    borderColor: '#22c55e',
  },
  refundTotal: {
    color: '#22c55e',
  },
});
